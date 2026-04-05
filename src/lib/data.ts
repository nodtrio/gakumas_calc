import supportCardCatalog from "@/data/cards/supportCards.catalog.json";
import ssrFreeCards from "@/data/cards/groups/ssr.free.json";
import ssrSenseCards from "@/data/cards/groups/ssr.sense.json";
import ssrLogicCards from "@/data/cards/groups/ssr.logic.json";
import ssrAnomalyCards from "@/data/cards/groups/ssr.anomaly.json";
import srFreeCards from "@/data/cards/groups/sr.free.json";
import srSenseCards from "@/data/cards/groups/sr.sense.json";
import srLogicCards from "@/data/cards/groups/sr.logic.json";
import srAnomalyCards from "@/data/cards/groups/sr.anomaly.json";
import perfectExamPolicy from "@/data/policies/examPolicy.perfect.json";
import midtermPolicy from "@/data/policies/policy_midterm_60000.json";
import defaultStage from "@/data/stages/stage_default.json";
import type { RunPolicy } from "@/domain/models/RunPolicy";
import type { Stage } from "@/domain/models/Stage";
import type { SupportCard } from "@/domain/models/SupportCard";

export const supportCardGroupCatalog = supportCardCatalog as { id: string; label: string; file: string }[];
export const supportCardDataset = [
  ...(ssrFreeCards as SupportCard[]),
  ...(ssrSenseCards as SupportCard[]),
  ...(ssrLogicCards as SupportCard[]),
  ...(ssrAnomalyCards as SupportCard[]),
  ...(srFreeCards as SupportCard[]),
  ...(srSenseCards as SupportCard[]),
  ...(srLogicCards as SupportCard[]),
  ...(srAnomalyCards as SupportCard[]),
];
export const stageDataset = [defaultStage as Stage];
export const policyDataset = [perfectExamPolicy as RunPolicy, midtermPolicy as RunPolicy];

export function getStageById(stageId: string): Stage {
  const stage = stageDataset.find((entry) => entry.id === stageId);
  if (!stage) throw new Error(`Unknown stage: ${stageId}`);
  return stage;
}

export function getPolicyById(policyId: string): RunPolicy {
  const policy = policyDataset.find((entry) => entry.id === policyId);
  if (!policy) throw new Error(`Unknown policy: ${policyId}`);
  return policy;
}

// TODO: 스테이지와 정책 종류가 많아지면 JSON을 동적으로 로드하도록 확장한다.
// TODO: 카드 그룹 파일을 실제 위키 분류와 1:1로 맞춰 세부 유지보수를 쉽게 만든다.
// TODO: 추후에는 사용자 보유 현황 JSON을 추가해 카드별 실제 돌파 단계를 적용한다.