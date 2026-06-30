"use client";

import { apiInstance } from "./api-config";

export const authClient = {
  async signInEmail(email: string, password: string) {
    const response = await apiInstance.post("/api/auth/sign-in/email", {
      email,
      password,
    });
    return response.data;
  },

  async signOut() {
    await apiInstance.post("/api/auth/sign-out");
  },

  async getSession() {
    try {
      const response = await apiInstance.get("/api/auth/get-session");
      return response.data;
    } catch {
      return null;
    }
  },
};
