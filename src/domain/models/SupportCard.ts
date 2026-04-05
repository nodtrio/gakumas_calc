export type StatKey = "vocal" | "dance" | "visual" | "mental";
export type ExamStatKey = Exclude<StatKey, "mental">;
export type CardType = StatKey;
export type CardRarity = "R" | "SR" | "SSR";
export type SupportPlan = "free" | "sense" | "logic" | "anomaly";
export type LimitBreakLevel = 0 | 1 | 2 | 3 | 4;
export type LimitBreakKey = "0" | "1" | "2" | "3" | "4";
export type SupportAbilitySlot = "アビ1" | "アビ2" | "アビ4" | "アビ5";

export type StatBlock = Record<StatKey, number>;
export type ExamStatBlock = Record<ExamStatKey, number>;

export interface LocalizedText {
  ko: string;
  ja: string;
}

export interface SupportCardImage {
  thumbnailPath: string;
  alt: string;
}

export interface SupportCardSnapshot {
  baseScore: number;
  trainingBonus: StatBlock;
  examBonus: ExamStatBlock;
  tags: string[];
  synergyTags: string[];
  description: string;
}

export interface SupportCardSource {
  defaultDataBasis: "max-breakthrough";
  referenceUrls: string[];
  note: string;
}

export interface SupportCardWikiEvent {
  reward: string;
  effect: string;
}

export interface SupportCardWikiAbility {
  slot: SupportAbilitySlot;
  effect: string;
}

export interface SupportCardWikiQuickReference {
  typeLabel: string;
  planLabel: string;
  event1: SupportCardWikiEvent;
  event2: string;
  event3: string;
  abilities: SupportCardWikiAbility[];
}

export interface SupportCardRawData {
  wikiQuickReference: SupportCardWikiQuickReference;
  notes: string[];
}

export interface SupportCardLimitBreakData {
  defaultSelectedLevel: LimitBreakLevel;
  maxKnownLevel: LimitBreakLevel;
  statScaleByLevel: Record<LimitBreakKey, number>;
  snapshots: Partial<Record<LimitBreakKey, SupportCardSnapshot>>;
}

export interface SupportCard {
  id: string;
  slug: string;
  names: LocalizedText;
  rarity: CardRarity;
  type: CardType;
  plan: SupportPlan;
  image: SupportCardImage;
  source: SupportCardSource;
  raw: SupportCardRawData;
  limitBreak: SupportCardLimitBreakData;
}

export interface ResolvedSupportCardSnapshot {
  level: LimitBreakLevel;
  isExact: boolean;
  estimatedFromLevel: LimitBreakLevel;
  scale: number;
  snapshot: SupportCardSnapshot;
}

const limitBreakLevels: LimitBreakLevel[] = [0, 1, 2, 3, 4];

export function getLimitBreakKey(level: LimitBreakLevel): LimitBreakKey {
  return String(level) as LimitBreakKey;
}

export function getLimitBreakLabel(level: LimitBreakLevel): string {
  if (level === 0) return "명함";
  return `${level}돌`;
}

export function getPlanLabel(plan: SupportPlan): string {
  switch (plan) {
    case "free": return "프리";
    case "sense": return "센스";
    case "logic": return "로직";
    case "anomaly": return "어노말리";
  }
}

export function getCardDisplayName(card: SupportCard): string {
  return card.names.ko;
}

export function parseLimitBreakLevel(input?: string): LimitBreakLevel {
  if (input === undefined) return 4;
  const parsed = Number(input);
  if (Number.isNaN(parsed)) return 4;
  if (parsed <= 0) return 0;
  if (parsed >= 4) return 4;
  return parsed as LimitBreakLevel;
}

export function resolveSupportCardSnapshot(card: SupportCard, level: LimitBreakLevel): ResolvedSupportCardSnapshot {
  const requestedKey = getLimitBreakKey(level);
  const exactSnapshot = card.limitBreak.snapshots[requestedKey];
  if (exactSnapshot) return { level, isExact: true, estimatedFromLevel: level, scale: 1, snapshot: exactSnapshot };

  const fallbackLevel = [...limitBreakLevels].reverse().find((candidateLevel) => card.limitBreak.snapshots[getLimitBreakKey(candidateLevel)]);
  if (fallbackLevel === undefined) throw new Error(`No usable snapshot found for support card: ${card.id}`);

  const fallbackKey = getLimitBreakKey(fallbackLevel);
  const fallbackSnapshot = card.limitBreak.snapshots[fallbackKey];
  if (!fallbackSnapshot) throw new Error(`Fallback snapshot missing for support card: ${card.id}`);

  const requestedScale = card.limitBreak.statScaleByLevel[requestedKey] ?? 1;
  const fallbackScale = card.limitBreak.statScaleByLevel[fallbackKey] ?? 1;
  const ratio = fallbackScale === 0 ? 1 : requestedScale / fallbackScale;

  return {
    level,
    isExact: false,
    estimatedFromLevel: fallbackLevel,
    scale: ratio,
    snapshot: {
      baseScore: Number((fallbackSnapshot.baseScore * ratio).toFixed(2)),
      trainingBonus: {
        vocal: Number((fallbackSnapshot.trainingBonus.vocal * ratio).toFixed(2)),
        dance: Number((fallbackSnapshot.trainingBonus.dance * ratio).toFixed(2)),
        visual: Number((fallbackSnapshot.trainingBonus.visual * ratio).toFixed(2)),
        mental: Number((fallbackSnapshot.trainingBonus.mental * ratio).toFixed(2))
      },
      examBonus: {
        vocal: Number((fallbackSnapshot.examBonus.vocal * ratio).toFixed(2)),
        dance: Number((fallbackSnapshot.examBonus.dance * ratio).toFixed(2)),
        visual: Number((fallbackSnapshot.examBonus.visual * ratio).toFixed(2))
      },
      tags: fallbackSnapshot.tags,
      synergyTags: fallbackSnapshot.synergyTags,
      description: `${fallbackSnapshot.description} (${getLimitBreakLabel(fallbackLevel)} 데이터를 비율 환산)`
    }
  };
}