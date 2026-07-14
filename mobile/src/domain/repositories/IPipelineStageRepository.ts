import type { PipelineStage } from '../entities/Order';

export interface IPipelineStageRepository {
  getAll(): Promise<PipelineStage[]>;
  save(stage: PipelineStage): Promise<void>;
  delete(id: string): Promise<void>;
}
