import type { ExamStatBlock, StatBlock } from "./SupportCard";

export interface Stage {
  id: string;
  name: string;
  description: string;
  weights: StatBlock;
  examWeights: ExamStatBlock;
  tagWeights: Record<string, number>;
}
