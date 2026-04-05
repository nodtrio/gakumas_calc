import type { RunPolicy } from "../models/RunPolicy";

export function getExamScoreMultiplier(policy: RunPolicy): number {
  return policy.examScoreAssumption.scoreRate;
}
