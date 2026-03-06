export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string; // ISO 8601: "2026-02-15T10:30:00Z"
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResponse {
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  expires_in: number; // seconds until access token expires
}

export interface RefreshRequest {}

export interface RefreshResponse {
  access_token: string;
  expires_in: number;
}

export interface LogoutRequest {}

export interface LogoutResponse {
  success: boolean;
}
