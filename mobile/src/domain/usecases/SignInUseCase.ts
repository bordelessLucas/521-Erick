import { IAuthRepository, SignInCredentials } from '../repositories/IAuthRepository';
import { User } from '../entities/User';
import { loginSchema } from '@/domain/schemas/auth.schema';
import { isValidCnpj } from '@/domain/utils/cnpj';
import { buildClientAuthPassword } from '@/domain/utils/clientAuthIdentity';

export class SignInUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(credentials: SignInCredentials): Promise<User> {
    const validated = loginSchema.parse(credentials);
    const identifier = validated.identifier.trim();
    const isCnpjLogin = !identifier.includes('@') && isValidCnpj(identifier);

    return this.authRepository.signIn({
      identifier,
      password: isCnpjLogin
        ? buildClientAuthPassword(identifier)
        : (validated.password ?? ''),
    });
  }
}
