import type { SupportCard } from "../models/SupportCard";

export interface SynergyResult {
  score: number;
  reasons: string[];
}

export function calculatePairSynergy(left: SupportCard, right: SupportCard): SynergyResult {
  const sharedTags = left.synergyTags.filter((tag) => right.synergyTags.includes(tag));
  const sharedTagScore = sharedTags.length * 4;
  const sameTypeScore = left.type === right.type ? 3 : 0;
  const total = sharedTagScore + sameTypeScore;

  const reasons = [
    ...sharedTags.map((tag) => `${left.name} + ${right.name}: shared tag ${tag}`),
    ...(sameTypeScore > 0 ? [`${left.name} + ${right.name}: same type ${left.type}`] : []),
  ];

  return {
    score: total,
    reasons,
  };
}
