"use client";

import { useEffect, useMemo, useState } from "react";
import type { OwnedSupportCardUpload } from "@/domain/models/OwnedSupportCard";
import { getLimitBreakLabel, type LimitBreakLevel, type SupportCard } from "@/domain/models/SupportCard";

interface OwnedCardsManagerProps {
  cards: SupportCard[];
  exampleJson: string;
}

function isOwnedUpload(value: unknown): value is OwnedSupportCardUpload {
  if (!value || typeof value !== "object") return false;
  const data = value as { version?: unknown; cards?: unknown };
  return data.version === 1 && Array.isArray(data.cards);
}

export function OwnedCardsManager({ cards, exampleJson }: OwnedCardsManagerProps) {
  const [rawText, setRawText] = useState(exampleJson);
  const [error, setError] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState<OwnedSupportCardUpload | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("gakumas_calc_owned_cards");
    if (stored) setRawText(stored);
  }, []);

  const cardMap = useMemo(() => new Map(cards.map((card) => [card.id, card])), [cards]);

  function handleApply() {
    try {
      const parsed = JSON.parse(rawText) as unknown;
      if (!isOwnedUpload(parsed)) {
        setError("업로드 JSON 형식이 맞지 않습니다.");
        return;
      }
      setUploaded(parsed);
      setError(null);
      localStorage.setItem("gakumas_calc_owned_cards", rawText);
    } catch {
      setError("JSON 파싱에 실패했습니다. 문법을 확인해 주세요.");
    }
  }

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    file.text().then((text) => setRawText(text));
  }

  const resolvedCards = uploaded?.cards ?? [];
  const ownedCards = resolvedCards.filter((entry) => entry.owned);

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="rounded-3xl border border-black/10 bg-white/85 p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-ink">보유 카드 업로드</h2>
        <p className="mt-2 text-sm leading-6 text-black/65">카드 ID와 돌파 단계를 JSON으로 업로드하면 메인 추천 페이지에서도 그대로 반영됩니다.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <label className="rounded-2xl border border-black/10 bg-paper px-4 py-3 text-sm font-medium text-ink">파일 선택<input type="file" accept="application/json" className="hidden" onChange={handleFileUpload} /></label>
          <button type="button" onClick={handleApply} className="rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-white">업로드 적용</button>
        </div>
        <textarea value={rawText} onChange={(event) => setRawText(event.target.value)} className="mt-4 min-h-80 w-full rounded-2xl border border-black/10 bg-white p-4 font-mono text-xs leading-6 text-black/75" />
        {error ? <p className="mt-3 text-sm font-medium text-red-600">{error}</p> : null}
      </div>

      <div className="grid gap-4">
        <section className="rounded-3xl border border-black/10 bg-white/85 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-ink">업로드 결과</h2>
          <div className="mt-4 grid gap-3 text-sm text-black/70">
            <p>전체 레코드 수: {resolvedCards.length}</p>
            <p>보유 카드 수: {ownedCards.length}</p>
            <p>미보유 카드 수: {resolvedCards.length - ownedCards.length}</p>
            <p>메인 추천 페이지는 브라우저 저장소에 저장된 이 JSON을 자동으로 읽습니다.</p>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white/85 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-ink">보유 카드 미리보기</h3>
          <div className="mt-4 grid gap-3">
            {ownedCards.length === 0 ? (
              <p className="text-sm text-black/55">아직 업로드된 보유 카드가 없습니다.</p>
            ) : (
              ownedCards.map((entry) => {
                const card = cardMap.get(entry.cardId);
                return (
                  <article key={entry.cardId} className="rounded-2xl bg-paper/70 p-4 text-sm text-black/70">
                    <p className="font-semibold text-ink">{card?.names.ko ?? entry.cardId}</p>
                    <p className="mt-1">돌파 단계: {getLimitBreakLabel(entry.limitBreakLevel as LimitBreakLevel)}</p>
                    <p className="mt-1 text-black/55">카드 ID: {entry.cardId}</p>
                    {entry.notes ? <p className="mt-1 text-black/55">메모: {entry.notes}</p> : null}
                  </article>
                );
              })
            )}
          </div>
        </section>
      </div>
    </section>
  );
}