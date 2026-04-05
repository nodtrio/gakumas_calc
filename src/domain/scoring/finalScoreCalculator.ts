import type { DeckEvaluationResult } from "../models/EvaluationResult";

export function formatPredictedScore(result: DeckEvaluationResult): string {
  return result.totalScore.toFixed(1);
}

// TODO: Replace string formatting with richer result normalization when
// stage-specific score caps or real exam simulators are introduced.
