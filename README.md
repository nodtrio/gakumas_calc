# gakumas_calc

범용 육성 점수 최대화를 목표로 서폿카 6장을 추천하는 MVP 프로젝트입니다.

## 구조

- `src/data/cards/groups`: `SSR 프리 -> SSR 센스 -> SSR 로직 -> SSR 어노말리 -> SR 프리 -> SR 센스 -> SR 로직 -> SR 어노말리` 순서의 카드 데이터 파일
- `src/data/cards/supportCards.catalog.json`: 카드 그룹 카탈로그
- `src/data/cards/ownedSupportCards.example.json`: 보유 카드/돌파 현황 예시 업로드 파일
- `src/data/schemas`: 데이터 검증용 JSON 스키마 초안
- `src/domain`: 추천 로직과 도메인 타입
- `src/components`: 추천 UI와 보유 카드 업로드 UI

## 메모

- 현재 일부 카드 데이터는 위키 Q&A 추천 카드명을 바탕으로 한 임시 입력입니다.
- 위키 빠른표 원문을 더 확보하면 각 그룹 파일에 실제 문구를 순차 반영할 수 있습니다.
- 추천 엔진은 보유 카드 업로드 JSON을 읽어 카드별 실제 돌파 단계를 반영합니다.