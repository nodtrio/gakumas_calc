"use client";

import type { RunPolicy } from "@/domain/models/RunPolicy";
import { getLimitBreakLabel, type LimitBreakLevel } from "@/domain/models/SupportCard";
import type { Stage } from "@/domain/models/Stage";

interface RecommendationFormProps {
  stages: Stage[];
  policies: RunPolicy[];
  selectedStageId: string;
  selectedPolicyId: string;
  selectedLimitBreakLevel: LimitBreakLevel;
  onStageChange?: (value: string) => void;
  onPolicyChange?: (value: string) => void;
  onLimitBreakChange?: (value: string) => void;
}

const limitBreakOptions: LimitBreakLevel[] = [0, 1, 2, 3, 4];

export function RecommendationForm({ stages, policies, selectedStageId, selectedPolicyId, selectedLimitBreakLevel, onStageChange, onPolicyChange, onLimitBreakChange }: RecommendationFormProps) {
  return (
    <div className="grid gap-4">
      <div>
        <label className="mb-2 block text-sm font-medium">스테이지</label>
        <select name="stageId" value={selectedStageId} onChange={(event) => onStageChange?.(event.target.value)} className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3">
          {stages.map((stage) => (
            <option key={stage.id} value={stage.id}>{stage.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">정책</label>
        <select name="policyId" value={selectedPolicyId} onChange={(event) => onPolicyChange?.(event.target.value)} className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3">
          {policies.map((policy) => (
            <option key={policy.id} value={policy.id}>{policy.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">기본 돌파 단계</label>
        <select name="limitBreakLevel" value={selectedLimitBreakLevel} onChange={(event) => onLimitBreakChange?.(event.target.value)} className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3">
          {limitBreakOptions.map((level) => (
            <option key={level} value={level}>{getLimitBreakLabel(level)}</option>
          ))}
        </select>
        <p className="mt-2 text-xs leading-5 text-black/55">보유 카드 업로드를 적용하면 카드별 실제 돌파 단계가 이 값보다 우선합니다.</p>
      </div>
    </div>
  );
}