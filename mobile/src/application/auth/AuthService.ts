import { LoginInput, RegisterInput } from '@/domain/schemas/auth.schema';
import { User } from '@/domain/entities/User';
import { SignInUseCase } from '@/domain/usecases/SignInUseCase';
import { SignUpUseCase } from '@/domain/usecases/SignUpUseCase';
import { IAuthRepository } from '@/domain/repositories/IAuthRepository';

export class AuthService {
  constructor(
    private readonly signInUseCase: SignInUseCase,
    private readonly signUpUseCase: SignUpUseCase,
    private readonly authRepository: IAuthRepository,
  ) {}

  async login(input: LoginInput): Promise<User> {
    return this.signInUseCase.execute(input);
  }

  async register(input: RegisterInput): Promise<User> {
    return this.signUpUseCase.execute(input);
  }

  async logout(): Promise<void> {
    return this.authRepository.signOut();
  }

  async getCurrentUser(): Promise<User | null> {
    return this.authRepository.getCurrentUser();
  }
}
