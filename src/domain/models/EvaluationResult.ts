import type { LimitBreakLevel, SupportCard } from "./SupportCard";

export interface ScoreBreakdown {
  base: number;
  training: number;
  exam: number;
  synergy: number;
  stageFit: number;
  total: number;
}

export interface CardScoreDetail {
  cardId: string;
  cardName: string;
  totalScore: number;
  breakdown: ScoreBreakdown;
  reasons: string[];
  selectedLimitBreakLevel: LimitBreakLevel;
  isEstimated: boolean;
  estimatedFromLevel: LimitBreakLevel;
}

export interface DeckEvaluationResult {
  cards: SupportCard[];
  totalScore: number;
  cardDetails: CardScoreDetail[];
  reasons: string[];
  selectedLimitBreakLevel: LimitBreakLevel;
  isUsingOwnedCollection: boolean;
  ownedCardCount: number;
}