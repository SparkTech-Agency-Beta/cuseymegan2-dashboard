export interface Admin {
  name: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  admin: Admin;
}
