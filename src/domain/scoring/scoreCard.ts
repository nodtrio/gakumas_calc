import type { CardScoreDetail, ScoreBreakdown } from "../models/EvaluationResult";
import type { RunPolicy } from "../models/RunPolicy";
import type { Stage } from "../models/Stage";
import type { SupportCard } from "../models/SupportCard";
import { getExamScoreMultiplier } from "./examScorePolicy";

function sumWeighted(values: Record<string, number>, weights: Record<string, number>): number {
  return Object.entries(values).reduce((total, [key, value]) => {
    return total + value * (weights[key] ?? 0);
  }, 0);
}

export function scoreCard(card: SupportCard, stage: Stage, policy: RunPolicy): CardScoreDetail {
  const base = card.baseScore * policy.scoring.baseCardWeight;
  const training = sumWeighted(card.trainingBonus, stage.weights) * policy.scoring.trainingWeight;
  const exam =
    sumWeighted(card.examBonus, stage.examWeights) *
    getExamScoreMultiplier(policy) *
    policy.scoring.examWeight;
  const stageFit =
    card.tags.reduce((total, tag) => total + (stage.tagWeights[tag] ?? 0), 0) *
    policy.scoring.stageFitWeight;

  const breakdown: ScoreBreakdown = {
    base,
    training,
    exam,
    synergy: 0,
    stageFit,
    total: base + training + exam + stageFit,
  };

  const reasons = [
    `${card.type} base score ${card.baseScore}`,
    `training contribution ${training.toFixed(1)}`,
    `exam contribution ${exam.toFixed(1)} under ${policy.name}`,
  ];

  // TODO: Replace the linear weighted model with richer estimators once
  // lesson turn order, event branches, and per-stage action economy are modeled.

  return {
    cardId: card.id,
    cardName: card.name,
    totalScore: breakdown.total,
    breakdown,
    reasons,
  };
}
