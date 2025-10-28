import jwt from 'jsonwebtoken';
import {
    findUserIdentity,
    findSystemUser,
    getUserPermissions,
    getUserRole,
    comparePassword,
    updateLoginMetadata,
    recordFailedLogin,
    isUserBlocked,
    mapUserData
} from '../services/auth.services.js';
import logger from '../utils/logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'frame24-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export const login = async (req, res) => {
    const { email, password } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');

    try {
        logger.info('🔐 Tentativa de login.', { email, ip: ipAddress });

        // 1. Validação de entrada
        if (!email || !password) {
            logger.warn('Email ou senha ausentes na tentativa de login.');
            return res.status(400).json({
                error: 'Email e senha são obrigatórios'
            });
        }

        // 2. Buscar Identity completa
        const identity = await findUserIdentity(email);

        if (!identity) {
            logger.warn('Identity não encontrada.', { email });
            return res.status(401).json({
                error: 'Credenciais inválidas'
            });
        }

        // 3. Verificar se usuário está bloqueado
        if (isUserBlocked(identity)) {
            const blockedUntil = new Date(identity.blocked_until).toLocaleString('pt-BR');
            logger.warn('Tentativa de login com conta bloqueada.', {
                email,
                blockedUntil
            });
            return res.status(403).json({
                error: `Conta temporariamente bloqueada até ${blockedUntil}`,
                reason: identity.block_reason
            });
        }

        const employee = identity.employees;
        if (!employee) {
            logger.error('Identity sem Employee associado.', {
                identityId: identity.id,
                email
            });
            return res.status(401).json({
                error: 'Credenciais inválidas'
            });
        }

        if (!employee.active) {
            logger.warn('Tentativa de login com funcionário inativo.', {
                employeeId: employee.id,
                email
            });
            return res.status(401).json({
                error: 'Usuário inativo. Contate o administrador.'
            });
        }

        const validPassword = await comparePassword(password, identity.password_hash);

        if (!validPassword) {
            const failedAttempts = await recordFailedLogin(identity.id);

            logger.warn('Tentativa de login com senha inválida.', {
                employeeId: employee.id,
                email,
                failedAttempts
            });

            return res.status(401).json({
                error: 'Credenciais inválidas',
                attemptsRemaining: Math.max(0, 5 - failedAttempts)
            });
        }

        const company = employee.companies;
        if (!company) {
            logger.error('Employee sem Company associada.', {
                employeeId: employee.id
            });
            return res.status(500).json({
                error: 'Erro na configuração do usuário'
            });
        }

        if (!company.active || company.suspended) {
            logger.warn('Tentativa de login em empresa inativa/suspensa.', {
                companyId: company.id,
                suspended: company.suspended
            });
            return res.status(403).json({
                error: 'Empresa inativa ou suspensa',
                reason: company.suspension_reason
            });
        }

        const systemUser = await findSystemUser(employee.id);
        if (!systemUser) {
            logger.error('System User não encontrado para Employee.', {
                employeeId: employee.id
            });
            return res.status(500).json({
                error: 'Erro na configuração do usuário'
            });
        }

        const userRole = await getUserRole(identity.id, company.id);
        const permissions = await getUserPermissions(systemUser.id, company.id);

        if (permissions.length === 0) {
            logger.warn('Usuário sem permissões atribuídas.', {
                systemUserId: systemUser.id,
                companyId: company.id
            });
        }

        const { jwtPayload, responseData } = mapUserData(
            identity,
            employee,
            company,
            systemUser,
            userRole,
            permissions
        );

        const token = jwt.sign(jwtPayload, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN
        });

        updateLoginMetadata(identity.id, ipAddress, userAgent).catch(err => {
            logger.error('Falha ao atualizar metadados de login.', {
                identityId: identity.id,
                message: err.message
            });
        });

        logger.info('✅ Login bem-sucedido.', {
            identityId: identity.id,
            systemUserId: systemUser.id,
            employeeId: employee.id,
            name: employee.full_name,
            role: userRole,
            tenant: company.tenant_slug,
            permissionsCount: permissions.length
        });

        res.json({
            success: true,
            message: 'Login realizado com sucesso',
            data: {
                token,
                user: responseData,
                expiresIn: JWT_EXPIRES_IN
            }
        });

    } catch (error) {
        logger.error('🔴 Erro inesperado no login.', {
            message: error.message,
            stack: error.stack,
            inputEmail: email,
            ip: ipAddress
        });

        res.status(500).json({
            error: 'Erro interno no servidor. Tente novamente.'
        });
    }
};


export const validateToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                error: 'Token não fornecido'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        // Buscar dados atualizados do usuário
        const identity = await findUserIdentity(decoded.email);

        if (!identity || !identity.active) {
            return res.status(401).json({
                error: 'Token inválido ou usuário inativo'
            });
        }

        res.json({
            success: true,
            data: {
                valid: true,
                user: decoded
            }
        });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Token expirado'
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                error: 'Token inválido'
            });
        }

        logger.error('Erro ao validar token.', {
            message: error.message
        });

        res.status(500).json({
            error: 'Erro ao validar token'
        });
    }
};


export const logout = async (req, res) => {
    try {

        logger.info('Logout realizado.', {
            userId: req.user?.sub
        });

        res.json({
            success: true,
            message: 'Logout realizado com sucesso'
        });

    } catch (error) {
        logger.error('Erro no logout.', {
            message: error.message
        });

        res.status(500).json({
            error: 'Erro ao realizar logout'
        });
    }
};