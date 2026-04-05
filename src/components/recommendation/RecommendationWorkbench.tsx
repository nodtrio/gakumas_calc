"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { RecommendationForm } from "@/components/inputs/RecommendationForm";
import { RecommendationResult } from "@/components/results/RecommendationResult";
import type { OwnedSupportCardUpload } from "@/domain/models/OwnedSupportCard";
import { parseLimitBreakLevel, type LimitBreakLevel, type SupportCard } from "@/domain/models/SupportCard";
import { searchBestDeck } from "@/domain/optimization/searchBestDeck";
import type { RunPolicy } from "@/domain/models/RunPolicy";
import type { Stage } from "@/domain/models/Stage";

interface RecommendationWorkbenchProps {
  cards: SupportCard[];
  stages: Stage[];
  policies: RunPolicy[];
  initialStageId: string;
  initialPolicyId: string;
  initialLimitBreakLevel: LimitBreakLevel;
  ownedExampleJson: string;
}

function isOwnedUpload(value: unknown): value is OwnedSupportCardUpload {
  if (!value || typeof value !== "object") return false;
  const data = value as { version?: unknown; cards?: unknown };
  return data.version === 1 && Array.isArray(data.cards);
}

export function RecommendationWorkbench({ cards, stages, policies, initialStageId, initialPolicyId, initialLimitBreakLevel, ownedExampleJson }: RecommendationWorkbenchProps) {
  const [selectedStageId, setSelectedStageId] = useState(initialStageId);
  const [selectedPolicyId, setSelectedPolicyId] = useState(initialPolicyId);
  const [selectedLimitBreakLevel, setSelectedLimitBreakLevel] = useState<LimitBreakLevel>(initialLimitBreakLevel);
  const [ownedUploadText, setOwnedUploadText] = useState(ownedExampleJson);
  const [useOwnedCards, setUseOwnedCards] = useState(false);
  const [ownedError, setOwnedError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("gakumas_calc_owned_cards");
    if (stored) setOwnedUploadText(stored);
  }, []);

  const selectedStage = stages.find((stage) => stage.id === selectedStageId) ?? stages[0];
  const selectedPolicy = policies.find((policy) => policy.id === selectedPolicyId) ?? policies[0];

  const parsedOwnedUpload = useMemo(() => {
    try {
      const parsed = JSON.parse(ownedUploadText) as unknown;
      if (!isOwnedUpload(parsed)) return null;
      return parsed;
    } catch {
      return null;
    }
  }, [ownedUploadText]);

  const ownedMap = useMemo(() => {
    const map = new Map<string, LimitBreakLevel>();
    if (!useOwnedCards || !parsedOwnedUpload) return map;
    parsedOwnedUpload.cards.forEach((entry) => {
      if (entry.owned) map.set(entry.cardId, entry.limitBreakLevel);
    });
    return map;
  }, [parsedOwnedUpload, useOwnedCards]);

  const candidateCards = useMemo(() => {
    if (!useOwnedCards || ownedMap.size === 0) return cards;
    return cards.filter((card) => ownedMap.has(card.id));
  }, [cards, ownedMap, useOwnedCards]);

  const recommendation = useMemo(() => {
    if (candidateCards.length < 6) return null;
    return searchBestDeck(candidateCards, selectedStage, selectedPolicy, {
      limitBreakLevel: selectedLimitBreakLevel,
      limitBreakOverrides: Object.fromEntries(ownedMap.entries()),
      isUsingOwnedCollection: useOwnedCards && ownedMap.size > 0,
      ownedCardCount: candidateCards.length,
    });
  }, [candidateCards, ownedMap, selectedLimitBreakLevel, selectedPolicy, selectedStage, useOwnedCards]);

  function handleOwnedApply() {
    if (!parsedOwnedUpload) {
      setOwnedError("보유 카드 JSON 형식이 올바르지 않습니다.");
      return;
    }
    localStorage.setItem("gakumas_calc_owned_cards", ownedUploadText);
    setOwnedError(null);
    setUseOwnedCards(true);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-10 md:px-8">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] bg-ink px-6 py-8 text-white shadow-lg">
          <p className="text-sm uppercase tracking-[0.2em] text-white/60">gakumas_calc</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">범용 육성 점수 최대화를 위한 서폿카 6장 추천기</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75 md:text-base">서폿카 원문 데이터, 스테이지, 정책을 분리한 MVP입니다. 이제 보유 카드 업로드 JSON을 불러와 실제 보유 카드와 돌파 단계 기준으로 추천을 다시 계산할 수 있습니다.</p>
        </div>
        <div className="grid gap-4">
          <div className="rounded-3xl border border-black/10 bg-white/80 p-6 shadow-sm">
            <RecommendationForm
              stages={stages}
              policies={policies}
              selectedStageId={selectedStageId}
              selectedPolicyId={selectedPolicyId}
              selectedLimitBreakLevel={selectedLimitBreakLevel}
              onStageChange={(value) => setSelectedStageId(value)}
              onPolicyChange={(value) => setSelectedPolicyId(value)}
              onLimitBreakChange={(value) => setSelectedLimitBreakLevel(parseLimitBreakLevel(value))}
            />
          </div>
          <div className="rounded-3xl border border-black/10 bg-white/80 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-ink">보유 카드 업로드 연동</p>
                <p className="mt-1 text-xs leading-5 text-black/55">`/collection` 페이지에서 관리하는 JSON을 여기에도 바로 붙여 넣을 수 있습니다.</p>
              </div>
              <Link href="/collection" className="text-sm font-medium text-accent">업로드 페이지로 이동</Link>
            </div>
            <textarea value={ownedUploadText} onChange={(event) => setOwnedUploadText(event.target.value)} className="mt-4 min-h-40 w-full rounded-2xl border border-black/10 bg-white p-4 font-mono text-xs leading-6 text-black/75" />
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" onClick={handleOwnedApply} className="rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-white">보유 카드 기준 적용</button>
              <button type="button" onClick={() => setUseOwnedCards(false)} className="rounded-2xl border border-black/10 bg-paper px-4 py-3 text-sm font-semibold text-ink">전체 카드 기준으로 보기</button>
            </div>
            {ownedError ? <p className="mt-3 text-sm font-medium text-red-600">{ownedError}</p> : null}
          </div>
        </div>
      </section>

      <section className="grid gap-3 rounded-3xl border border-black/10 bg-white/75 p-5 text-sm text-black/70 md:grid-cols-4">
        <div><p className="font-semibold text-ink">선택한 스테이지</p><p>{selectedStage.name}</p></div>
        <div><p className="font-semibold text-ink">선택한 정책</p><p>{selectedPolicy.name}</p></div>
        <div><p className="font-semibold text-ink">전역 돌파 기준</p><p>{selectedLimitBreakLevel === 0 ? "명함" : `${selectedLimitBreakLevel}돌`}</p></div>
        <div><p className="font-semibold text-ink">보유 카드 적용</p><p>{useOwnedCards && ownedMap.size > 0 ? `${ownedMap.size}장 반영` : "적용 안 함"}</p></div>
      </section>

      {candidateCards.length < 6 ? (
        <section className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm leading-6 text-red-900">
          <p className="font-semibold">추천 계산 불가</p>
          <p>현재 조건으로 추천 가능한 카드가 6장 미만입니다. 보유 카드 업로드를 끄거나 더 많은 카드를 보유 상태로 등록해 주세요.</p>
        </section>
      ) : null}

      {recommendation ? <RecommendationResult result={recommendation} /> : null}
    </main>
  );
}