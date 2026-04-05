import ownedExample from "@/data/cards/ownedSupportCards.example.json";
import { OwnedCardsManager } from "@/components/collection/OwnedCardsManager";
import { supportCardDataset } from "@/lib/data";

export default function CollectionPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-10 md:px-8">
      <section className="rounded-[2rem] bg-ink px-6 py-8 text-white shadow-lg">
        <p className="text-sm uppercase tracking-[0.2em] text-white/60">gakumas_calc</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">보유 카드와 돌파 현황 업로드</h1>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-white/75 md:text-base">
          서포트 카드 보유 현황을 JSON으로 관리하기 위한 페이지입니다. 현재는 업로드 내용을 검증하고 미리보기하는 MVP이며,
          다음 단계에서 실제 추천 계산과 연결할 예정입니다.
        </p>
      </section>

      <section className="rounded-3xl border border-black/10 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-950">
        <p className="font-semibold">업로드 형식</p>
        <p>`version: 1`과 `cards` 배열을 사용합니다. 각 카드에는 `cardId`, `owned`, `limitBreakLevel`, 선택적으로 `notes`를 넣을 수 있습니다.</p>
      </section>

      <OwnedCardsManager cards={supportCardDataset} exampleJson={JSON.stringify(ownedExample, null, 2)} />
    </main>
  );
}