import type { DeckEvaluationResult } from "../models/EvaluationResult";
import type { RunPolicy } from "../models/RunPolicy";
import type { Stage } from "../models/Stage";
import type { SupportCard } from "../models/SupportCard";
import { calculatePairSynergy } from "../optimization/synergyCalculator";
import { scoreCard } from "./scoreCard";

export function evaluateDeck(
  cards: SupportCard[],
  stage: Stage,
  policy: RunPolicy,
): DeckEvaluationResult {
  const cardDetails = cards.map((card) => scoreCard(card, stage, policy));
  let synergy = 0;
  const synergyReasons: string[] = [];

  for (let index = 0; index < cards.length; index += 1) {
    for (let next = index + 1; next < cards.length; next += 1) {
      const pair = calculatePairSynergy(cards[index], cards[next]);
      synergy += pair.score;
      synergyReasons.push(...pair.reasons);
    }
  }

  const weightedSynergy = synergy * policy.scoring.synergyWeight;
  const updatedCardDetails = cardDetails.map((detail) => ({
    ...detail,
    breakdown: {
      ...detail.breakdown,
      synergy: 0,
      total: detail.breakdown.total,
    },
  }));

  // TODO: Allocate synergy and policy side-effects back into per-card breakdowns
  // when the UI needs more detailed explanation than deck-level reasons.

  const cardReasons = updatedCardDetails
    .slice()
    .sort((left, right) => right.totalScore - left.totalScore)
    .slice(0, 3)
    .map((detail) => `${detail.cardName}: solo value ${detail.totalScore.toFixed(1)}`);

  return {
    cards,
    totalScore:
      updatedCardDetails.reduce((total, detail) => total + detail.totalScore, 0) + weightedSynergy,
    cardDetails: updatedCardDetails,
    reasons: [...cardReasons, ...synergyReasons.slice(0, 5)],
  };
}
