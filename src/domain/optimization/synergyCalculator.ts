import { getCardDisplayName, resolveSupportCardSnapshot, type LimitBreakLevel, type SupportCard } from "../models/SupportCard";

export interface SynergyResult {
  score: number;
  reasons: string[];
}

export function calculatePairSynergy(
  left: SupportCard,
  right: SupportCard,
  leftLevel: LimitBreakLevel,
  rightLevel: LimitBreakLevel,
): SynergyResult {
  const leftSnapshot = resolveSupportCardSnapshot(left, leftLevel).snapshot;
  const rightSnapshot = resolveSupportCardSnapshot(right, rightLevel).snapshot;
  const sharedTags = leftSnapshot.synergyTags.filter((tag) => rightSnapshot.synergyTags.includes(tag));
  const sharedTagScore = sharedTags.length * 4;
  const sameTypeScore = left.type === right.type ? 3 : 0;
  const leftName = getCardDisplayName(left);
  const rightName = getCardDisplayName(right);

  return {
    score: sharedTagScore + sameTypeScore,
    reasons: [
      ...sharedTags.map((tag) => `${leftName} + ${rightName}: 공통 시너지 태그 ${tag}`),
      ...(sameTypeScore > 0 ? [`${leftName} + ${rightName}: 동일 타입 ${left.type}`] : [])
    ]
  };
}