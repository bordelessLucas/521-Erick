import type { Order } from '@/domain/entities/Order';
import type { ClientAccessCredentials } from '@/domain/entities/Client';
import type { CreateOrderData } from '@/domain/repositories/IOrderRepository';
import type { IClientRepository } from '@/domain/repositories/IClientRepository';
import type { IOrderRepository } from '@/domain/repositories/IOrderRepository';
import { ClientProvisioningError } from '@/infrastructure/firebase/FirebaseClientRepository';
import { formatCnpj, normalizeCnpj } from '@/domain/utils/cnpj';
import { buildDefaultCompanyName } from '@/domain/utils/clientAuthIdentity';

export interface CreateOrderWithClientInput extends CreateOrderData {
  companyName?: string;
  clientEmail?: string;
}

export interface CreateOrderWithClientResult {
  order: Order;
  newClientCredentials?: ClientAccessCredentials;
}

export class AdminOrderService {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly clientRepository: IClientRepository,
  ) {}

  async createOrderWithClient(
    input: CreateOrderWithClientInput,
  ): Promise<CreateOrderWithClientResult> {
    const normalizedCnpj = formatCnpj(normalizeCnpj(input.clientCnpj));
    const existingClient = await this.clientRepository.findByCnpj(normalizedCnpj);

    let newClientCredentials: ClientAccessCredentials | undefined;

    if (!existingClient) {
      const companyName = input.companyName?.trim() || buildDefaultCompanyName(normalizedCnpj);

      if (companyName.length < 2) {
        throw new ClientProvisioningError('Informe o nome da empresa para criar o acesso do cliente.');
      }

      newClientCredentials = await this.clientRepository.provisionClient({
        companyName,
        clientEmail: input.clientEmail?.trim().toLowerCase(),
        clientCnpj: normalizedCnpj,
      });
    }

    const order = await this.orderRepository.create({
      ...input,
      clientCnpj: normalizedCnpj,
    });

    return {
      order,
      newClientCredentials,
    };
  }
}
