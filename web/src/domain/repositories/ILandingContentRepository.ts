import type { LandingContent } from '@/domain/entities/LandingContent';

export interface ILandingContentRepository {
  get(): Promise<LandingContent>;
  save(content: LandingContent): Promise<void>;
}
