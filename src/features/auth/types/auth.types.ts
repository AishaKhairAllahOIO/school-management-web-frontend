export interface LoginPayload {

  email: string;

  password: string;

  rememberMe: boolean;
}

export interface User {

  id: number;

  name: string;

  email: string;

  role: string;
}

export interface LoginResponse {

  token: string;

  user: User;
}
