import type { DeckEvaluationResult } from "@/domain/models/EvaluationResult";
import { formatPredictedScore } from "@/domain/scoring/finalScoreCalculator";

interface RecommendationResultProps {
  result: DeckEvaluationResult;
}

export function RecommendationResult({ result }: RecommendationResultProps) {
  return (
    <section className="grid gap-5 rounded-3xl border border-black/10 bg-white/85 p-6 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-black/10 pb-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-black/45">Predicted Score</p>
          <h2 className="text-3xl font-semibold">{formatPredictedScore(result)}</h2>
        </div>
        <p className="max-w-xl text-sm text-black/60">
          MVP score = solo card value + pair synergy + stage fit + policy-adjusted exam value.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {result.cards.map((card, index) => {
          const detail = result.cardDetails.find((entry) => entry.cardId === card.id);

          return (
            <article key={card.id} className="rounded-2xl border border-black/10 bg-paper/70 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-black/45">Slot {index + 1}</p>
              <h3 className="mt-1 text-lg font-semibold">{card.name}</h3>
              <p className="text-sm text-black/65">
                {card.rarity} / {card.type}
              </p>
              <p className="mt-3 text-sm text-black/70">{card.description}</p>
              <p className="mt-3 text-sm font-medium">
                Solo score: {detail?.totalScore.toFixed(1) ?? "-"}
              </p>
            </article>
          );
        })}
      </div>

      <div className="rounded-2xl bg-ink px-5 py-4 text-white">
        <h3 className="text-lg font-semibold">Recommendation Reasons</h3>
        <ul className="mt-3 grid gap-2 text-sm text-white/85">
          {result.reasons.map((reason) => (
            <li key={reason}>- {reason}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
