import { IAuthRepository, SignInCredentials, SignUpCredentials } from '@/domain/repositories/IAuthRepository';
import { User } from '@/domain/entities/User';

/**
 * Implementação futura para Supabase Auth.
 * Substituir no container quando AUTH_PROVIDER=supabase.
 */
export class SupabaseAuthRepository implements IAuthRepository {
  async signIn(_credentials: SignInCredentials): Promise<User> {
    throw new Error('Supabase Auth ainda não configurado.');
  }

  async signUp(_credentials: SignUpCredentials): Promise<User> {
    throw new Error('Supabase Auth ainda não configurado.');
  }

  async signOut(): Promise<void> {
    throw new Error('Supabase Auth ainda não configurado.');
  }

  async getCurrentUser(): Promise<User | null> {
    return null;
  }
}
