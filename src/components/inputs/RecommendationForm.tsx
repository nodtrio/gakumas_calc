"use client";

import type { RunPolicy } from "@/domain/models/RunPolicy";
import type { Stage } from "@/domain/models/Stage";

interface RecommendationFormProps {
  stages: Stage[];
  policies: RunPolicy[];
  selectedStageId: string;
  selectedPolicyId: string;
}

export function RecommendationForm({
  stages,
  policies,
  selectedStageId,
  selectedPolicyId,
}: RecommendationFormProps) {
  return (
    <form className="grid gap-4 rounded-3xl border border-black/10 bg-white/80 p-6 shadow-sm">
      <div>
        <label className="mb-2 block text-sm font-medium">Stage</label>
        <select
          name="stageId"
          defaultValue={selectedStageId}
          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3"
        >
          {stages.map((stage) => (
            <option key={stage.id} value={stage.id}>
              {stage.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Policy</label>
        <select
          name="policyId"
          defaultValue={selectedPolicyId}
          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3"
        >
          {policies.map((policy) => (
            <option key={policy.id} value={policy.id}>
              {policy.name}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="rounded-2xl bg-accent px-5 py-3 font-semibold text-white transition hover:brightness-95"
      >
        Recommend Best Deck
      </button>
    </form>
  );
}
