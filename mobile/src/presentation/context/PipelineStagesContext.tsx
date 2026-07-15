import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { PipelineStage } from '@/domain/entities/Order';
import { container } from '@/infrastructure/di/container';
import { DefaultOrderStatuses } from '@/domain/entities/Order';

const DEFAULT_STAGES: PipelineStage[] = [
  {
    id: DefaultOrderStatuses.AGUARDANDO_APROVACAO,
    label: 'Aguardando aprovação',
    shortLabel: 'Aprovação',
    description: 'Seu pedido foi recebido e aguarda validação comercial.',
    orderIndex: 0,
    averageMinutes: 10,
  },
  {
    id: DefaultOrderStatuses.APROVADO,
    label: 'Pedido aprovado',
    shortLabel: 'Aprovado',
    description: 'O pedido foi confirmado e entrou na fila de produção.',
    orderIndex: 1,
    averageMinutes: 5,
  },
  {
    id: DefaultOrderStatuses.ORDEM_DE_ROLINHO,
    label: 'Ordem de rolinho',
    shortLabel: 'Rolinho',
    description: 'A ordem de rolinho foi emitida para a fábrica.',
    orderIndex: 2,
    averageMinutes: 5,
  },
  {
    id: DefaultOrderStatuses.SEPARACAO,
    label: 'Separação',
    shortLabel: 'Separação',
    description: 'Materiais e insumos estão sendo separados.',
    orderIndex: 3,
    averageMinutes: 5,
  },
  {
    id: DefaultOrderStatuses.PRODUCAO,
    label: 'Em produção',
    shortLabel: 'Produção',
    description: 'Seu pedido está sendo produzido na fábrica.',
    orderIndex: 4,
    averageMinutes: 3,
  },
  {
    id: DefaultOrderStatuses.FATURADO,
    label: 'Faturado',
    shortLabel: 'Faturado',
    description: 'Pedido concluído e faturado com sucesso.',
    orderIndex: 5,
    averageMinutes: 0,
  },
];

interface PipelineStagesContextValue {
  stages: PipelineStage[];
  isLoading: boolean;
  refresh: () => Promise<void>;
}

const PipelineStagesContext = createContext<PipelineStagesContextValue>({
  stages: DEFAULT_STAGES,
  isLoading: true,
  refresh: async () => {},
});

export function PipelineStagesProvider({ children }: { children: ReactNode }) {
  const [stages, setStages] = useState<PipelineStage[]>(DEFAULT_STAGES);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStages = async () => {
    setIsLoading(true);
    try {
      const repo = container.getPipelineStageRepository();
      const data = await repo.getAll();
      if (data.length > 0) {
        const withMinutes = data.map((stage) => {
          if (stage.averageMinutes > 0) {
            return stage;
          }
          const fallback = DEFAULT_STAGES.find((item) => item.id === stage.id);
          return {
            ...stage,
            averageMinutes: fallback?.averageMinutes ?? 0,
          };
        });
        setStages(withMinutes);
      } else {
        for (const stage of DEFAULT_STAGES) {
          await repo.save(stage);
        }
        setStages(DEFAULT_STAGES);
      }
    } catch (error: any) {
      if (error?.code === 'permission-denied') {
        console.warn(
          '⚠️ Sem permissão para ler as etapas do banco (regras desatualizadas). Usando etapas locais.',
        );
      } else {
        console.error('Error fetching pipeline stages:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchStages();
  }, []);

  return (
    <PipelineStagesContext.Provider value={{ stages, isLoading, refresh: fetchStages }}>
      {children}
    </PipelineStagesContext.Provider>
  );
}

export function usePipelineStages() {
  return useContext(PipelineStagesContext);
}
