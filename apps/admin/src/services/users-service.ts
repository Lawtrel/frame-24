import { UserManagementApi } from "@repo/api-types";
import { apiConfig } from "./api-config";

const api = new UserManagementApi(apiConfig);

export const UsersService = {
  getAll: async () => {
    const response = await api.userManagementControllerListUsersV1();
    return response.data;
  },

  getById: async (employeeId: string) => {
    const response = await api.userManagementControllerGetUserV1(employeeId);
    return response.data;
  },

  create: async (data: any) => {
    // Ajuste o tipo 'any' para CreateUserDto se quiser tipagem estrita
    const response = await api.userManagementControllerCreateUserV1({
        createUserDto: data
    });
    return response.data;
  },
  
  delete: async (employeeId: string) => {
    return api.userManagementControllerDeleteUserV1(employeeId);
  }
};