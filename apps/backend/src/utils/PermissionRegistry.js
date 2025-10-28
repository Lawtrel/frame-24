class PermissionRegistry {
    constructor() {
        this.permissions = new Set();
    }


    add(permission) {
        if (typeof permission === 'string' && permission) {
            this.permissions.add(permission);
        }
    }


    getAll() {
        return Array.from(this.permissions).sort();
    }
}

export const permissionRegistry = new PermissionRegistry();