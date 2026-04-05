import type { LimitBreakLevel } from "./SupportCard";

export interface OwnedSupportCardRecord {
  cardId: string;
  owned: boolean;
  limitBreakLevel: LimitBreakLevel;
  notes?: string;
}

export interface OwnedSupportCardUpload {
  version: 1;
  cards: OwnedSupportCardRecord[];
}