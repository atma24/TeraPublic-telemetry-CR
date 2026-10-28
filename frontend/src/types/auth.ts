export type UserRole = "admin" | "citizen";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthPayload {
  user: User;
  token_type: string;
  access_token: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  data: AuthPayload;
}

export interface MeResponse {
  status: string;
  data: User;
}

export interface Session {
  user: User;
  token: string;
}

export interface AuthActionState {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
}
