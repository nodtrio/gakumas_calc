export type ExamScoreMode = "perfect" | "fixed-rate";

export interface ExamScoreAssumption {
  mode: ExamScoreMode;
  scoreRate: number;
}

export interface ScoringPreset {
  baseCardWeight: number;
  trainingWeight: number;
  examWeight: number;
  synergyWeight: number;
  stageFitWeight: number;
}

export interface RunPolicy {
  id: string;
  name: string;
  description: string;
  examScoreAssumption: ExamScoreAssumption;
  scoring: ScoringPreset;
}
