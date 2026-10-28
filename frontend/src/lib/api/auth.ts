import "server-only";

import { apiRequest } from "./client";
import type { AuthResponse, MeResponse } from "@/types/auth";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export function login(payload: LoginPayload) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: { ...payload, device_name: "TeraPublic Web" },
    cache: "no-store",
  });
}

export function register(payload: RegisterPayload) {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: payload,
    cache: "no-store",
  });
}

export function getMe(token: string) {
  return apiRequest<MeResponse>("/auth/me", {
    token,
    cache: "no-store",
  });
}

export function logout(token: string) {
  return apiRequest<{ status: string; message: string }>("/auth/logout", {
    method: "POST",
    token,
    cache: "no-store",
  });
}
