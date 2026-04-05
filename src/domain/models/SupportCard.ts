export type StatKey = "vocal" | "dance" | "visual" | "mental";
export type ExamStatKey = Exclude<StatKey, "mental">;
export type CardType = StatKey;
export type CardRarity = "R" | "SR" | "SSR";

export type StatBlock = Record<StatKey, number>;
export type ExamStatBlock = Record<ExamStatKey, number>;

export interface SupportCard {
  id: string;
  name: string;
  rarity: CardRarity;
  type: CardType;
  baseScore: number;
  trainingBonus: StatBlock;
  examBonus: ExamStatBlock;
  tags: string[];
  synergyTags: string[];
  description: string;
}
