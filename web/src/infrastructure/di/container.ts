import { createAuthRepository } from '@/infrastructure/auth/createAuthRepository';
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
import { FirebaseClientRepository } from '@/infrastructure/firebase/FirebaseClientRepository';
import { FirebaseOrderRepository } from '@/infrastructure/firebase/FirebaseOrderRepository';
import { FirebasePipelineStageRepository } from '@/infrastructure/firebase/FirebasePipelineStageRepository';
import { FirebaseCollaboratorRepository } from '@/infrastructure/firebase/FirebaseCollaboratorRepository';
import { FirebaseAgentOrderLinkRepository } from '@/infrastructure/agent/FirebaseAgentOrderLinkRepository';
import type { IPipelineStageRepository } from '@/domain/repositories/IPipelineStageRepository';
import type { ICollaboratorRepository } from '@/domain/repositories/ICollaboratorRepository';
import { RuleBasedAgentInterpreter } from '@/infrastructure/agent/RuleBasedAgentInterpreter';
import { StubExternalSystemAdapter } from '@/infrastructure/agent/StubExternalSystemAdapter';

const authProvider = (process.env.NEXT_PUBLIC_AUTH_PROVIDER ?? 'firebase') as
  | 'firebase'
  | 'supabase';

class Container {
  private authRepository: IAuthRepository | null = null;
  private orderRepository: IOrderRepository | null = null;
  private clientRepository: IClientRepository | null = null;
  private adminOrderService: AdminOrderService | null = null;
  private agentLinkRepository: IAgentOrderLinkRepository | null = null;
  private externalSystemAdapter: IExternalSystemAdapter | null = null;
  private agentInterpreter: IAgentInterpreter | null = null;
  private systemAgentService: SystemAgentService | null = null;
  private pipelineStageRepository: IPipelineStageRepository | null = null;
  private collaboratorRepository: ICollaboratorRepository | null = null;

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

  getPipelineStageRepository(): IPipelineStageRepository {
    if (!this.pipelineStageRepository) {
      this.pipelineStageRepository = new FirebasePipelineStageRepository();
    }
    return this.pipelineStageRepository;
  }

  getCollaboratorRepository(): ICollaboratorRepository {
    if (!this.collaboratorRepository) {
      this.collaboratorRepository = new FirebaseCollaboratorRepository();
    }
    return this.collaboratorRepository;
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
      // Trocar StubExternalSystemAdapter pelo adapter real do Erick quando disponível.
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
