import type { CardScoreDetail, ScoreBreakdown } from "../models/EvaluationResult";
import { getCardDisplayName, getLimitBreakLabel, resolveSupportCardSnapshot, type LimitBreakLevel, type SupportCard } from "../models/SupportCard";
import type { RunPolicy } from "../models/RunPolicy";
import type { Stage } from "../models/Stage";
import { getExamScoreMultiplier } from "./examScorePolicy";

function sumWeighted(values: Record<string, number>, weights: Record<string, number>): number {
  return Object.entries(values).reduce((total, [key, value]) => total + value * (weights[key] ?? 0), 0);
}

export function scoreCard(card: SupportCard, stage: Stage, policy: RunPolicy, limitBreakLevel: LimitBreakLevel): CardScoreDetail {
  const resolvedSnapshot = resolveSupportCardSnapshot(card, limitBreakLevel);
  const base = resolvedSnapshot.snapshot.baseScore * policy.scoring.baseCardWeight;
  const training = sumWeighted(resolvedSnapshot.snapshot.trainingBonus, stage.weights) * policy.scoring.trainingWeight;
  const exam = sumWeighted(resolvedSnapshot.snapshot.examBonus, stage.examWeights) * getExamScoreMultiplier(policy) * policy.scoring.examWeight;
  const stageFit = resolvedSnapshot.snapshot.tags.reduce((total, tag) => total + (stage.tagWeights[tag] ?? 0), 0) * policy.scoring.stageFitWeight;
  const breakdown: ScoreBreakdown = { base, training, exam, synergy: 0, stageFit, total: base + training + exam + stageFit };

  const reasons = [
    `${getLimitBreakLabel(limitBreakLevel)} 기준 기본 점수 ${resolvedSnapshot.snapshot.baseScore.toFixed(1)}`,
    `훈련 기여도 ${training.toFixed(1)}`,
    `${policy.name} 기준 시험 기여도 ${exam.toFixed(1)}`
  ];
  if (!resolvedSnapshot.isExact) reasons.push(`${getLimitBreakLabel(resolvedSnapshot.estimatedFromLevel)} 데이터를 비율 환산한 추정치`);

  return {
    cardId: card.id,
    cardName: getCardDisplayName(card),
    totalScore: breakdown.total,
    breakdown,
    reasons,
    selectedLimitBreakLevel: limitBreakLevel,
    isEstimated: !resolvedSnapshot.isExact,
    estimatedFromLevel: resolvedSnapshot.estimatedFromLevel
  };
}