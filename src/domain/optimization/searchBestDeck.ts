import type { DeckEvaluationResult } from "../models/EvaluationResult";
import type { RunPolicy } from "../models/RunPolicy";
import type { Stage } from "../models/Stage";
import type { LimitBreakLevel, SupportCard } from "../models/SupportCard";
import { evaluateDeck } from "../scoring/evaluateDeck";
import { pruneCandidates } from "./candidatePruner";

export interface SearchOptions {
  deckSize?: number;
  candidateCount?: number;
  limitBreakLevel?: LimitBreakLevel;
  limitBreakOverrides?: Partial<Record<string, LimitBreakLevel>>;
  isUsingOwnedCollection?: boolean;
  ownedCardCount?: number;
}

function getCombinations(cards: SupportCard[], deckSize: number): SupportCard[][] {
  const results: SupportCard[][] = [];
  function walk(start: number, picked: SupportCard[]): void {
    if (picked.length === deckSize) {
      results.push([...picked]);
      return;
    }
    for (let index = start; index < cards.length; index += 1) {
      picked.push(cards[index]);
      walk(index + 1, picked);
      picked.pop();
    }
  }
  walk(0, []);
  return results;
}

export function searchBestDeck(cards: SupportCard[], stage: Stage, policy: RunPolicy, options: SearchOptions = {}): DeckEvaluationResult {
  const deckSize = options.deckSize ?? 6;
  const candidateCount = options.candidateCount ?? Math.max(deckSize + 2, 8);
  const defaultLimitBreakLevel = options.limitBreakLevel ?? 4;
  const getLimitBreakLevel = (card: SupportCard): LimitBreakLevel => options.limitBreakOverrides?.[card.id] ?? defaultLimitBreakLevel;
  const candidates = pruneCandidates(cards, stage, policy, candidateCount, getLimitBreakLevel);
  const combinations = getCombinations(candidates, deckSize);

  if (combinations.length === 0) throw new Error("Not enough cards to build a deck.");

  let bestResult = evaluateDeck(combinations[0], stage, policy, getLimitBreakLevel, options.isUsingOwnedCollection ?? false, options.ownedCardCount ?? cards.length);
  for (let index = 1; index < combinations.length; index += 1) {
    const current = evaluateDeck(combinations[index], stage, policy, getLimitBreakLevel, options.isUsingOwnedCollection ?? false, options.ownedCardCount ?? cards.length);
    if (current.totalScore > bestResult.totalScore) bestResult = current;
  }
  return bestResult;
}