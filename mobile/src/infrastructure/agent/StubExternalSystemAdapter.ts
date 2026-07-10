import type {
  ExternalSystemEvent,
  ExternalSystemSnapshot,
} from '@/domain/agent/ExternalSystemEvent';
import type { IExternalSystemAdapter } from '@/domain/agent/IAgentPorts';

/**
 * Adapter stub do sistema/banco do Erick (mobile).
 * A sync autônoma principal roda no web/API; o mobile compartilha o contrato.
 */
export class StubExternalSystemAdapter implements IExternalSystemAdapter {
  readonly sourceName = 'erick-external-stub';

  isConfigured(): boolean {
    return (
      process.env.EXPO_PUBLIC_AGENT_EXTERNAL_SYNC_ENABLED === 'true' ||
      process.env.AGENT_EXTERNAL_SYNC_ENABLED === 'true'
    );
  }

  async healthCheck(): Promise<{ ok: boolean; detail: string }> {
    if (!this.isConfigured()) {
      return {
        ok: false,
        detail:
          'Adapter stub inativo. Conecte o sistema do Erick no backend/web para sync autônoma.',
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
