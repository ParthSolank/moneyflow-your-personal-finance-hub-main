import api from "./client";

const API_URL = "/users";

export interface SystemUser {
  id: string;
  email: string;
  fullName: string;
  role: "admin" | "user";
  isActive: boolean;
  createdAt: string;
}

export interface ModulePermission {
  module: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export const userService = {
  async getUsers(): Promise<SystemUser[]> {
    const response = await api.get(API_URL);
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`${API_URL}/${id}`);
  },

  async toggleUserStatus(id: string): Promise<void> {
    await api.put(`${API_URL}/${id}/toggle-status`);
  },

  async changeUserRole(id: string, role: string): Promise<void> {
    await api.put(`${API_URL}/${id}/change-role`, { role });
  },

  async getUserPermissions(id: string): Promise<ModulePermission[]> {
    const response = await api.get(`${API_URL}/${id}/permissions`);
    return response.data;
  },

  async updateUserPermissions(id: string, permissions: ModulePermission[]): Promise<void> {
    await api.put(`${API_URL}/${id}/permissions`, permissions);
  }
};
