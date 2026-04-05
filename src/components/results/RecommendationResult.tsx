import type { DeckEvaluationResult } from "@/domain/models/EvaluationResult";
import { getCardDisplayName, getLimitBreakLabel, getPlanLabel, resolveSupportCardSnapshot } from "@/domain/models/SupportCard";
import { formatPredictedScore } from "@/domain/scoring/finalScoreCalculator";

interface RecommendationResultProps {
  result: DeckEvaluationResult;
}

export function RecommendationResult({ result }: RecommendationResultProps) {
  return (
    <section className="grid gap-5 rounded-3xl border border-black/10 bg-white/85 p-6 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-black/10 pb-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-black/45">예상 점수</p>
          <h2 className="text-3xl font-semibold">{formatPredictedScore(result)}</h2>
        </div>
        <div className="max-w-xl text-sm text-black/60">
          <p>MVP 점수는 카드 단독 가치, 카드 간 시너지, 스테이지 적합도, 정책 반영 시험 점수를 합산해 계산합니다.</p>
          <p className="mt-2">{result.isUsingOwnedCollection ? `보유 카드 ${result.ownedCardCount}장 기준으로 계산 중입니다.` : `전체 카드 풀 기준으로 계산 중입니다.`}</p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {result.cards.map((card, index) => {
          const detail = result.cardDetails.find((entry) => entry.cardId === card.id);
          const snapshot = resolveSupportCardSnapshot(card, detail?.selectedLimitBreakLevel ?? result.selectedLimitBreakLevel);

          return (
            <article key={card.id} className="overflow-hidden rounded-2xl border border-black/10 bg-paper/70">
              <img src={card.image.thumbnailPath} alt={card.image.alt} className="h-48 w-full object-cover" />
              <div className="p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-black/45">{index + 1}번 슬롯</p>
                <h3 className="mt-1 text-lg font-semibold">{getCardDisplayName(card)}</h3>
                <p className="text-sm text-black/55">{card.names.ja}</p>
                <p className="mt-2 text-sm text-black/65">{card.rarity} / {getPlanLabel(card.plan)} / {card.type}</p>
                <p className="mt-1 text-xs text-black/50">위키 표기: {card.raw.wikiQuickReference.typeLabel} / {card.raw.wikiQuickReference.planLabel}</p>
                <p className="mt-1 text-xs text-black/50">적용 돌파: {getLimitBreakLabel(detail?.selectedLimitBreakLevel ?? result.selectedLimitBreakLevel)} / {snapshot.isExact ? "원문 반영" : "비율 환산"}</p>
                <p className="mt-3 text-sm text-black/70">{snapshot.snapshot.description}</p>
                <p className="mt-3 text-sm font-medium">단독 점수: {detail?.totalScore.toFixed(1) ?? "-"}</p>
                <div className="mt-3 rounded-2xl bg-white/80 p-3 text-xs leading-5 text-black/65">
                  <p className="font-semibold text-black/75">위키 빠른표 요약</p>
                  <p className="mt-1">이벤트1: {card.raw.wikiQuickReference.event1.reward}</p>
                  <p>{card.raw.wikiQuickReference.event1.effect}</p>
                  <p className="mt-1">이벤트2: {card.raw.wikiQuickReference.event2}</p>
                  <p>이벤트3: {card.raw.wikiQuickReference.event3}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl bg-ink px-5 py-4 text-white">
          <h3 className="text-lg font-semibold">추천 이유</h3>
          <ul className="mt-3 grid gap-2 text-sm text-white/85">
            {result.reasons.map((reason) => <li key={reason}>- {reason}</li>)}
          </ul>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white/80 px-5 py-4">
          <h3 className="text-lg font-semibold text-ink">빠른표 능력 예시</h3>
          <div className="mt-3 grid gap-3 text-sm text-black/70">
            {result.cards.slice(0, 2).map((card) => (
              <div key={card.id} className="rounded-xl bg-paper/70 p-3">
                <p className="font-semibold text-ink">{card.names.ko}</p>
                {card.raw.wikiQuickReference.abilities.map((ability) => (
                  <p key={`${card.id}-${ability.slot}`} className="mt-1">{ability.slot}: {ability.effect}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}