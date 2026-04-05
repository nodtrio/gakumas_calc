import type { RunPolicy } from "../models/RunPolicy";
import type { Stage } from "../models/Stage";
import type { LimitBreakLevel, SupportCard } from "../models/SupportCard";
import { scoreCard } from "../scoring/scoreCard";

export function pruneCandidates(
  cards: SupportCard[],
  stage: Stage,
  policy: RunPolicy,
  candidateCount: number,
  getLimitBreakLevel: (card: SupportCard) => LimitBreakLevel,
): SupportCard[] {
  return cards
    .map((card) => ({ card, score: scoreCard(card, stage, policy, getLimitBreakLevel(card)).totalScore }))
    .sort((left, right) => right.score - left.score)
    .slice(0, candidateCount)
    .map((entry) => entry.card);
}