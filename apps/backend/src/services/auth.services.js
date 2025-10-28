import prisma from '../lib/prisma.js';
import bcrypt from 'bcrypt';


export const hashPassword = async (password) => {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password, hash) => {
    return bcrypt.compare(password, hash);
};

export const findUserIdentity = async (email) => {
    return prisma.identities.findFirst({
        where: {
            email: email,
            active: true,
            identity_type: 'EMPLOYEE'
        },
        include: {
            employees: {
                include: {
                    companies: true,
                    cinema_complexes: true,
                    positions: {
                        include: {
                            departments: true
                        }
                    }
                }
            },
            company_users: {
                include: {
                    companies: true
                }
            }
        }
    });
};


export const findSystemUser = async (employeeId) => {
    return prisma.system_users.findFirst({
        where: {
            employee_id: employeeId,
            active: true
        },
        include: {
            user_profiles_user_profiles_user_idTosystem_users: {
                where: { active: true },
                include: {
                    access_profiles: {
                        include: {
                            profile_permissions: {
                                include: {
                                    system_routines: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });
};

export const getUserPermissions = async (systemUserId, companyId) => {
    const userProfiles = await prisma.user_profiles.findMany({
        where: {
            user_id: systemUserId,
            company_id: companyId,
            active: true
        },
        include: {
            access_profiles: {
                include: {
                    profile_permissions: {
                        include: {
                            system_routines: true
                        }
                    }
                }
            }
        }
    });

    const allPermissions = new Set();

    userProfiles.forEach(userProfile => {
        const profile = userProfile.access_profiles;

        if (!profile || !profile.profile_permissions) {
            return;
        }

        profile.profile_permissions.forEach(permission => {
            const routine = permission.system_routines;

            if (!routine) {
                return;
            }

            const operation = permission.operation.toLowerCase();

            const permissionString = `${routine.module}:${routine.code}:${operation}`;
            allPermissions.add(permissionString);
        });
    });

    return Array.from(allPermissions);
};


export const getUserRole = async (identityId, companyId) => {
    const companyUser = await prisma.company_users.findFirst({
        where: {
            identity_id: identityId,
            company_id: companyId,
            active: true
        }
    });

    return companyUser?.role || 'USER';
};

export const updateLoginMetadata = async (identityId, ipAddress = null, userAgent = null) => {
    await prisma.identities.update({
        where: { id: identityId },
        data: {
            last_login_date: new Date(),
            last_login_ip: ipAddress,
            last_user_agent: userAgent,
            login_count: { increment: 1 },
            failed_login_attempts: 0, // Reset em caso de login bem-sucedido
            last_failed_login: null
        }
    });
};

export const recordFailedLogin = async (identityId) => {
    const identity = await prisma.identities.findUnique({
        where: { id: identityId }
    });

    const failedAttempts = (identity.failed_login_attempts || 0) + 1;
    const maxAttempts = 5;

    const updateData = {
        failed_login_attempts: failedAttempts,
        last_failed_login: new Date()
    };

    if (failedAttempts >= maxAttempts) {
        const blockDuration = 30;
        updateData.blocked_until = new Date(Date.now() + blockDuration * 60 * 1000);
        updateData.block_reason = 'Múltiplas tentativas de login falhadas';
    }

    await prisma.identities.update({
        where: { id: identityId },
        data: updateData
    });

    return failedAttempts;
};


export const isUserBlocked = (identity) => {
    if (!identity.blocked_until) return false;

    const now = new Date();
    const blockedUntil = new Date(identity.blocked_until);

    return now < blockedUntil;
};

export const mapUserData = (identity, employee, company, systemUser, userRole, permissions) => {
    return {
        jwtPayload: {
            sub: identity.id.toString(),
            identity_id: identity.id.toString(),
            system_user_id: systemUser.id.toString(),
            employee_id: employee.id.toString(),
            email: identity.email,
            name: employee.full_name,
            tenant_slug: company.tenant_slug,
            company_id: company.id.toString(),
            complex_id: employee.cinema_complexes.id.toString(),
            role: userRole,
            permissions: permissions,
            employee_number: employee.employee_number,
            position: employee.positions?.name || null,
            department: employee.positions?.departments?.name || null
        },
        responseData: {
            id: employee.id.toString(),
            identity_id: identity.id.toString(),
            system_user_id: systemUser.id.toString(),
            name: employee.full_name,
            email: identity.email,
            employee_number: employee.employee_number,
            role: userRole,
            tenant_slug: company.tenant_slug,
            company: {
                id: company.id.toString(),
                name: company.corporate_name,
                trade_name: company.trade_name,
                cnpj: company.cnpj
            },
            complex: {
                id: employee.cinema_complexes.id.toString(),
                name: employee.cinema_complexes.name,
                code: employee.cinema_complexes.code
            },
            position: employee.positions?.name || null,
            department: employee.positions?.departments?.name || null,
            permissions: permissions
        }
    };
};