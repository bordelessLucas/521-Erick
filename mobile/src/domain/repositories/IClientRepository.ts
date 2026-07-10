import type { ClientAccessCredentials, ClientSummary } from '@/domain/entities/Client';

export interface ProvisionClientInput {
  companyName?: string;
  clientEmail?: string;
  clientCnpj: string;
}

export interface IClientRepository {
  findByCnpj(clientCnpj: string): Promise<ClientSummary | null>;
  provisionClient(input: ProvisionClientInput): Promise<ClientAccessCredentials>;
}
