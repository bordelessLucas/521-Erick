import type {
  ExternalSystemEvent,
  ExternalSystemSnapshot,
} from '@/domain/agent/ExternalSystemEvent';
import type { IExternalSystemAdapter } from '@/domain/agent/IAgentPorts';

/**
 * Adapter stub do sistema/banco do Erick.
 * Substituir por implementação real (API, SQL, webhook push, etc.).
 */
export class StubExternalSystemAdapter implements IExternalSystemAdapter {
  readonly sourceName = 'erick-external-stub';

  isConfigured(): boolean {
    return process.env.AGENT_EXTERNAL_SYNC_ENABLED === 'true';
  }

  async healthCheck(): Promise<{ ok: boolean; detail: string }> {
    if (!this.isConfigured()) {
      return {
        ok: false,
        detail:
          'Adapter stub inativo. Defina AGENT_EXTERNAL_SYNC_ENABLED=true e troque por um adapter real.',
      };
    }

    return {
      ok: true,
      detail: 'Stub configurado — ainda sem conexão real com o sistema do Erick.',
    };
  }

  async fetchRecentEvents(_sinceIso?: string): Promise<ExternalSystemSnapshot> {
    const events: ExternalSystemEvent[] = [];

    return {
      source: this.sourceName,
      fetchedAt: new Date().toISOString(),
      events,
    };
  }
}
