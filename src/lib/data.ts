import supportCards from "@/data/cards/supportCards.json";
import perfectExamPolicy from "@/data/policies/examPolicy.perfect.json";
import midtermPolicy from "@/data/policies/policy_midterm_60000.json";
import defaultStage from "@/data/stages/stage_default.json";
import type { RunPolicy } from "@/domain/models/RunPolicy";
import type { Stage } from "@/domain/models/Stage";
import type { SupportCard } from "@/domain/models/SupportCard";

export const supportCardDataset = supportCards as SupportCard[];
export const stageDataset = [defaultStage as Stage];
export const policyDataset = [perfectExamPolicy as RunPolicy, midtermPolicy as RunPolicy];

export function getStageById(stageId: string): Stage {
  const stage = stageDataset.find((entry) => entry.id === stageId);
  if (!stage) {
    throw new Error(`Unknown stage: ${stageId}`);
  }
  return stage;
}

export function getPolicyById(policyId: string): RunPolicy {
  const policy = policyDataset.find((entry) => entry.id === policyId);
  if (!policy) {
    throw new Error(`Unknown policy: ${policyId}`);
  }
  return policy;
}

// TODO: Load JSON files dynamically when stage/policy catalogs become large.
