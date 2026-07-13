import type { PipelineStage } from '@/domain/entities/Order';

export interface IPipelineStageRepository {
  getAll(): Promise<PipelineStage[]>;
  getById(id: string): Promise<PipelineStage | null>;
  save(stage: PipelineStage): Promise<void>;
  delete(id: string): Promise<void>;
  reorder(stages: { id: string; orderIndex: number }[]): Promise<void>;
}
