"use client";

import { apiClient } from "../services/api-config";

export const authClient = {
  async signInEmail(email: string, password: string) {
    const response = await apiClient.post("/api/auth/sign-in/email", {
      email,
      password,
    });
    return response.data;
  },

  async signOut() {
    await apiClient.post("/api/auth/sign-out");
  },

  async getSession() {
    try {
      const response = await apiClient.get("/api/auth/get-session");
      return response.data;
    } catch {
      return null;
    }
  },
};
