package authz

default allow = false

allow if {
    input.user.role == "ADMIN"
}

allow if {
    input.user.role == "SUPER_ADMIN"
}

allow if {
    valid_tenant
    valid_permission
}

valid_tenant if {
    input.user.tenant_id == input.resource.tenant_id
}

valid_permission if {
    required_permission := sprintf("%v:%v", [input.resource.type, input.action])
    required_permission in input.user.permissions
}