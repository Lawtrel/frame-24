"use client";

import { createAuthClient } from "better-auth/react";

const resolvedBaseURL =
  typeof window !== "undefined"
    ? `${window.location.origin}/api/auth`
    : process.env.NEXT_PUBLIC_AUTH_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const authClient: ReturnType<typeof createAuthClient> = createAuthClient({
  baseURL: resolvedBaseURL,
  fetchOptions: {
    credentials: "include",
  },
});
