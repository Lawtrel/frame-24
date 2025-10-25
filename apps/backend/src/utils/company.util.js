export function generateTenantSlug(corporateName, cnpj) {
    const cleanName = corporateName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '-');
    const cnpjSuffix = cnpj.replace(/\D/g, '').slice(-4);
    return `${cleanName}-${cnpjSuffix}`.substring(0, 50);
}

export function generateEmployeeNumber(companyId) {
    const year = new Date().getFullYear();
    return `${year}${companyId.toString().padStart(3, '0')}0001`;
}