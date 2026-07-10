import type { ExternalSystemEvent, ExternalSystemSnapshot } from './ExternalSystemEvent';
import type { AgentAction } from './AgentCapability';

/**
 * Porta de leitura do sistema externo do Erick.
 * Trocar StubExternalSystemAdapter pela implementação real quando houver credenciais/API.
 */
export interface IExternalSystemAdapter {
  readonly sourceName: string;
  isConfigured(): boolean;
  fetchRecentEvents(sinceIso?: string): Promise<ExternalSystemSnapshot>;
  /** Opcional: validar conectividade com o sistema externo */
  healthCheck(): Promise<{ ok: boolean; detail: string }>;
}

/**
 * Cérebro do agente: transforma evento externo em ações no Trançatto.
 * Hoje: regras determinísticas. Depois: LLM/agente com as mesmas saídas.
 */
export interface IAgentInterpreter {
  interpret(event: ExternalSystemEvent): Promise<AgentAction[]>;
}
