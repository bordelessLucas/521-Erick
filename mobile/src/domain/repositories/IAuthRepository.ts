import { User } from '../entities/User';

export interface SignInCredentials {
  identifier: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  companyName: string;
  cnpj: string;
}

export interface IAuthRepository {
  signIn(credentials: SignInCredentials): Promise<User>;
  signUp(credentials: SignUpCredentials): Promise<User>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}
