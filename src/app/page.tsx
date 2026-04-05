import { RecommendationForm } from "@/components/inputs/RecommendationForm";
import { RecommendationResult } from "@/components/results/RecommendationResult";
import { searchBestDeck } from "@/domain/optimization/searchBestDeck";
import { getPolicyById, getStageById, policyDataset, stageDataset, supportCardDataset } from "@/lib/data";

interface HomePageProps {
  searchParams?: Promise<{
    stageId?: string;
    policyId?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedParams = (await searchParams) ?? {};
  const selectedStageId = resolvedParams.stageId ?? stageDataset[0].id;
  const selectedPolicyId = resolvedParams.policyId ?? policyDataset[0].id;

  const selectedStage = getStageById(selectedStageId);
  const selectedPolicy = getPolicyById(selectedPolicyId);
  const result = searchBestDeck(supportCardDataset, selectedStage, selectedPolicy);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-10 md:px-8">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] bg-ink px-6 py-8 text-white shadow-lg">
          <p className="text-sm uppercase tracking-[0.2em] text-white/60">gakumas_calc</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">
            범용 육성 점수 최대화를 위한 서폿카 6장 추천기
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75 md:text-base">
            카드 데이터, 스테이지, 정책을 분리해 둔 MVP 구조입니다. 지금은 근사치 기반 평가 엔진으로
            추천하고, 나중에는 더 정교한 시뮬레이터로 쉽게 교체할 수 있게 설계했습니다.
          </p>
        </div>
        <RecommendationForm
          stages={stageDataset}
          policies={policyDataset}
          selectedStageId={selectedStageId}
          selectedPolicyId={selectedPolicyId}
        />
      </section>

      <section className="grid gap-3 rounded-3xl border border-black/10 bg-white/75 p-5 text-sm text-black/70 md:grid-cols-3">
        <div>
          <p className="font-semibold text-ink">Selected Stage</p>
          <p>{selectedStage.name}</p>
        </div>
        <div>
          <p className="font-semibold text-ink">Selected Policy</p>
          <p>{selectedPolicy.name}</p>
        </div>
        <div>
          <p className="font-semibold text-ink">Evaluation Model</p>
          <p>Single-card score + synergy + stage fit + policy-adjusted exam</p>
        </div>
      </section>

      <RecommendationResult result={result} />
    </main>
  );
}
