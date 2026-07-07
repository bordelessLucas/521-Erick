import { createAuthRepository } from '@/infrastructure/auth/createAuthRepository';
import { SignInUseCase } from '@/domain/usecases/SignInUseCase';
import { SignUpUseCase } from '@/domain/usecases/SignUpUseCase';
import { AuthService } from '@/application/auth/AuthService';
import { IAuthRepository } from '@/domain/repositories/IAuthRepository';
import { IOrderRepository } from '@/domain/repositories/IOrderRepository';
import { FirebaseOrderRepository } from '@/infrastructure/firebase/FirebaseOrderRepository';

const authProvider = (process.env.NEXT_PUBLIC_AUTH_PROVIDER ?? 'firebase') as
  | 'firebase'
  | 'supabase';

class Container {
  private authRepository: IAuthRepository | null = null;
  private orderRepository: IOrderRepository | null = null;

  getAuthRepository(): IAuthRepository {
    if (!this.authRepository) {
      this.authRepository = createAuthRepository(authProvider);
    }
    return this.authRepository;
  }

  getOrderRepository(): IOrderRepository {
    if (!this.orderRepository) {
      this.orderRepository = new FirebaseOrderRepository();
    }
    return this.orderRepository;
  }

  getSignInUseCase(): SignInUseCase {
    return new SignInUseCase(this.getAuthRepository());
  }

  getSignUpUseCase(): SignUpUseCase {
    return new SignUpUseCase(this.getAuthRepository());
  }

  getAuthService(): AuthService {
    return new AuthService(
      this.getSignInUseCase(),
      this.getSignUpUseCase(),
      this.getAuthRepository(),
    );
  }
}

export const container = new Container();
