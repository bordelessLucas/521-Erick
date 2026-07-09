import { createAuthRepository } from '@/infrastructure/auth/createAuthRepository';
import { SignInUseCase } from '@/domain/usecases/SignInUseCase';
import { SignUpUseCase } from '@/domain/usecases/SignUpUseCase';
import { AuthService } from '@/application/auth/AuthService';
import { AdminOrderService } from '@/application/orders/AdminOrderService';
import { IAuthRepository } from '@/domain/repositories/IAuthRepository';
import { IClientRepository } from '@/domain/repositories/IClientRepository';
import { IOrderRepository } from '@/domain/repositories/IOrderRepository';
import { FirebaseClientRepository } from '@/infrastructure/firebase/FirebaseClientRepository';
import { FirebaseOrderRepository } from '@/infrastructure/firebase/FirebaseOrderRepository';

const authProvider = (process.env.NEXT_PUBLIC_AUTH_PROVIDER ?? 'firebase') as
  | 'firebase'
  | 'supabase';

class Container {
  private authRepository: IAuthRepository | null = null;
  private orderRepository: IOrderRepository | null = null;
  private clientRepository: IClientRepository | null = null;
  private adminOrderService: AdminOrderService | null = null;

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

  getClientRepository(): IClientRepository {
    if (!this.clientRepository) {
      this.clientRepository = new FirebaseClientRepository();
    }
    return this.clientRepository;
  }

  getAdminOrderService(): AdminOrderService {
    if (!this.adminOrderService) {
      this.adminOrderService = new AdminOrderService(
        this.getOrderRepository(),
        this.getClientRepository(),
      );
    }
    return this.adminOrderService;
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
