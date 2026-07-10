import { FirebaseAuthRepository } from '@/infrastructure/firebase/FirebaseAuthRepository';
import { FirebaseClientRepository } from '@/infrastructure/firebase/FirebaseClientRepository';
import { FirebaseOrderRepository } from '@/infrastructure/firebase/FirebaseOrderRepository';
import { SignInUseCase } from '@/domain/usecases/SignInUseCase';
import { SignUpUseCase } from '@/domain/usecases/SignUpUseCase';
import { AuthService } from '@/application/auth/AuthService';
import { AdminOrderService } from '@/application/orders/AdminOrderService';
import { SystemAgentService } from '@/application/agent/SystemAgentService';
import { IAuthRepository } from '@/domain/repositories/IAuthRepository';
import { IClientRepository } from '@/domain/repositories/IClientRepository';
import { IOrderRepository } from '@/domain/repositories/IOrderRepository';
import type { IAgentOrderLinkRepository } from '@/domain/agent/IAgentOrderLinkRepository';
import type { IAgentInterpreter, IExternalSystemAdapter } from '@/domain/agent/IAgentPorts';
import { FirebaseAgentOrderLinkRepository } from '@/infrastructure/agent/FirebaseAgentOrderLinkRepository';
import { RuleBasedAgentInterpreter } from '@/infrastructure/agent/RuleBasedAgentInterpreter';
import { StubExternalSystemAdapter } from '@/infrastructure/agent/StubExternalSystemAdapter';

class Container {
  private authRepository: IAuthRepository | null = null;
  private orderRepository: IOrderRepository | null = null;
  private clientRepository: IClientRepository | null = null;
  private adminOrderService: AdminOrderService | null = null;
  private agentLinkRepository: IAgentOrderLinkRepository | null = null;
  private externalSystemAdapter: IExternalSystemAdapter | null = null;
  private agentInterpreter: IAgentInterpreter | null = null;
  private systemAgentService: SystemAgentService | null = null;

  getAuthRepository(): IAuthRepository {
    if (!this.authRepository) {
      this.authRepository = new FirebaseAuthRepository();
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

  getAgentOrderLinkRepository(): IAgentOrderLinkRepository {
    if (!this.agentLinkRepository) {
      this.agentLinkRepository = new FirebaseAgentOrderLinkRepository();
    }
    return this.agentLinkRepository;
  }

  getExternalSystemAdapter(): IExternalSystemAdapter {
    if (!this.externalSystemAdapter) {
      this.externalSystemAdapter = new StubExternalSystemAdapter();
    }
    return this.externalSystemAdapter;
  }

  getAgentInterpreter(): IAgentInterpreter {
    if (!this.agentInterpreter) {
      this.agentInterpreter = new RuleBasedAgentInterpreter();
    }
    return this.agentInterpreter;
  }

  getSystemAgentService(): SystemAgentService {
    if (!this.systemAgentService) {
      this.systemAgentService = new SystemAgentService(
        this.getExternalSystemAdapter(),
        this.getAgentInterpreter(),
        this.getOrderRepository(),
        this.getClientRepository(),
        this.getAdminOrderService(),
        this.getAgentOrderLinkRepository(),
      );
    }
    return this.systemAgentService;
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
