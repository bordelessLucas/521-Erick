import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { RuleBasedAgentInterpreter } from '@/infrastructure/agent/RuleBasedAgentInterpreter';
import { StubExternalSystemAdapter } from '@/infrastructure/agent/StubExternalSystemAdapter';
import { ACTIVE_AGENT_CAPABILITIES } from '@/domain/agent/AgentCapability';
import type { ExternalSystemEvent } from '@/domain/agent/ExternalSystemEvent';

const ingestSchema = z.object({
  id: z.string().min(1),
  source: z.string().min(1),
  type: z.enum(['ORDER_UPSERTED', 'ORDER_STATUS_CHANGED', 'CLIENT_UPSERTED', 'UNKNOWN']),
  occurredAt: z.string().min(1),
  payload: z.record(z.string(), z.unknown()),
  raw: z.unknown().optional(),
  /** Se true, tenta executar (requer sessão admin no runtime client; no server use Admin SDK depois) */
  execute: z.boolean().optional(),
});

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.AGENT_SYNC_SECRET;
  if (!secret) {
    return process.env.NODE_ENV === 'development';
  }

  return request.headers.get('x-agent-secret') === secret;
}

export async function GET() {
  const adapter = new StubExternalSystemAdapter();
  const external = await adapter.healthCheck();

  return NextResponse.json({
    agent: 'trancatto-system-agent',
    ready: adapter.isConfigured(),
    capabilities: ACTIVE_AGENT_CAPABILITIES,
    external,
    note: 'Execução autônoma no Firestore deve rodar com sessão admin (client) ou Admin SDK (server).',
  });
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as unknown;
  const parsed = ingestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid event payload', issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const event: ExternalSystemEvent = {
    id: parsed.data.id,
    source: parsed.data.source,
    type: parsed.data.type,
    occurredAt: parsed.data.occurredAt,
    payload: parsed.data.payload,
    raw: parsed.data.raw,
  };

  const interpreter = new RuleBasedAgentInterpreter();
  const plannedActions = await interpreter.interpret(event);

  if (!parsed.data.execute) {
    return NextResponse.json({
      mode: 'plan',
      plannedActions,
      message:
        'Evento interpretado. Envie execute=true a partir do painel admin autenticado para aplicar no Firestore.',
    });
  }

  try {
    const { container } = await import('@/infrastructure/di/container');
    const result = await container.getSystemAgentService().ingestEvent(event);
    return NextResponse.json({ mode: 'execute', ...result });
  } catch (error) {
    return NextResponse.json(
      {
        mode: 'execute',
        plannedActions,
        error:
          error instanceof Error
            ? error.message
            : 'Falha ao executar. Use o painel admin autenticado ou configure Firebase Admin SDK.',
      },
      { status: 503 },
    );
  }
}
