import { IAuthRepository, SignUpCredentials } from '../repositories/IAuthRepository';
import { User } from '../entities/User';
import { registerSchema } from '../schemas/auth.schema';
import { formatCnpj, normalizeCnpj } from '../utils/cnpj';

export class SignUpUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(input: SignUpCredentials & { confirmPassword: string }): Promise<User> {
    const validated = registerSchema.parse(input);

    return this.authRepository.signUp({
      email: validated.email.toLowerCase(),
      password: validated.password,
      companyName: validated.companyName,
      cnpj: formatCnpj(normalizeCnpj(validated.cnpj)),
    });
  }
}
