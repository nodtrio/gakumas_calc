import ownedExample from "@/data/cards/ownedSupportCards.example.json";
import { RecommendationWorkbench } from "@/components/recommendation/RecommendationWorkbench";
import { parseLimitBreakLevel } from "@/domain/models/SupportCard";
import { policyDataset, stageDataset, supportCardDataset } from "@/lib/data";

interface HomePageProps {
  searchParams?: Promise<{ stageId?: string; policyId?: string; limitBreakLevel?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedParams = (await searchParams) ?? {};
  const selectedStageId = resolvedParams.stageId ?? stageDataset[0].id;
  const selectedPolicyId = resolvedParams.policyId ?? policyDataset[0].id;
  const selectedLimitBreakLevel = parseLimitBreakLevel(resolvedParams.limitBreakLevel);

  return (
    <RecommendationWorkbench
      cards={supportCardDataset}
      stages={stageDataset}
      policies={policyDataset}
      initialStageId={selectedStageId}
      initialPolicyId={selectedPolicyId}
      initialLimitBreakLevel={selectedLimitBreakLevel}
      ownedExampleJson={JSON.stringify(ownedExample, null, 2)}
    />
  );
}