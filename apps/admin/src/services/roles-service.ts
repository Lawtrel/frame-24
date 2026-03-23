import {
  RolesApi,
  PermissionsApi,
  CreateRoleDto,
  UpdateRoleDto,
} from "@repo/api-types";
import { apiConfig } from "./api-config";

const rolesApi = new RolesApi(apiConfig);
const permissionsApi = new PermissionsApi(apiConfig); // Adiciona a API de Permissões

export const RolesService = {
  // READ: Lista todos os Perfis de Acesso
  getAll: async () => {
    const response = await rolesApi.rolesControllerListRolesV1();
    return response.data;
  },

  // GET /v1/permissions: Lista todas as permissões (Necessário para a tela New Role)
  getPermissions: async () => {
    const response = await permissionsApi.permissionsControllerListPermissionsV1();
    return response.data;
  },

  // CREATE: Cria novo perfil
  create: async (data: CreateRoleDto) => {
    return await rolesApi.rolesControllerCreateRoleV1({ createRoleDto: data });
  },

  // GET /v1/roles/:id
  getById: async (id: string) => {
    const response = await rolesApi.rolesControllerGetRoleV1({ id });
    return response.data;
  },

  // UPDATE /v1/roles/:id
  update: async (id: string, data: UpdateRoleDto) => {
    return await rolesApi.rolesControllerUpdateRoleV1({ id, updateRoleDto: data });
  },

  // DELETE /v1/roles/:id
  delete: async (id: string) => {
    return await rolesApi.rolesControllerDeleteRoleV1({ id });
  },
};
