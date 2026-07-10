'use client';

import { useCallback, useState } from 'react';
import type { ExternalSystemEvent } from '@/domain/agent/ExternalSystemEvent';
import type { AgentSyncRunResult } from '@/application/agent/SystemAgentService';
import { ACTIVE_AGENT_CAPABILITIES, type AgentCapability } from '@/domain/agent/AgentCapability';

interface UseSystemAgentReturn {
  capabilities: readonly AgentCapability[];
  isRunning: boolean;
  lastResult: AgentSyncRunResult | null;
  error: string | null;
  ingestEvent: (event: ExternalSystemEvent) => Promise<AgentSyncRunResult | null>;
  pullAndSync: (sinceIso?: string) => Promise<AgentSyncRunResult | null>;
  clearError: () => void;
}

/**
 * Ponto de entrada do agente no painel admin (sessão autenticada).
 * Webhooks externos podem planejar ações via /api/agent/sync;
 * a execução no Firestore usa este hook enquanto não houver Admin SDK.
 */
export function useSystemAgent(): UseSystemAgentReturn {
  const [isRunning, setIsRunning] = useState(false);
  const [lastResult, setLastResult] = useState<AgentSyncRunResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ingestEvent = useCallback(async (event: ExternalSystemEvent) => {
    setIsRunning(true);
    setError(null);

    try {
      const { container } = await import('@/infrastructure/di/container');
      const result = await container.getSystemAgentService().ingestEvent(event);
      setLastResult(result);
      return result;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Falha ao executar o agente.';
      setError(message);
      return null;
    } finally {
      setIsRunning(false);
    }
  }, []);

  const pullAndSync = useCallback(async (sinceIso?: string) => {
    setIsRunning(true);
    setError(null);

    try {
      const { container } = await import('@/infrastructure/di/container');
      const result = await container.getSystemAgentService().pullAndSync(sinceIso);
      setLastResult(result);
      return result;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Falha ao sincronizar com o sistema externo.';
      setError(message);
      return null;
    } finally {
      setIsRunning(false);
    }
  }, []);

  return {
    capabilities: ACTIVE_AGENT_CAPABILITIES,
    isRunning,
    lastResult,
    error,
    ingestEvent,
    pullAndSync,
    clearError: () => setError(null),
  };
}
