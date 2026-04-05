# gakumas_calc

가쿠마스에서 범용적으로 육성 점수 최대화를 목표로 서폿카 6장을 추천하는 MVP 프로젝트입니다.

## 지금 할 수 있는 것

- 스테이지와 정책을 분리해서 추천 계산
- 서폿카 그룹 JSON을 읽어 6장 추천
- 추천 점수와 추천 이유 표시
- 보유 카드와 돌파 현황 JSON 업로드 화면 제공
- 업로드한 보유 카드 기준으로 추천 후보를 좁히는 구조 제공

## 폴더 구조

- `src/data/cards/groups`
  서폿카 데이터를 `SSR 프리 -> SSR 센스 -> SSR 로직 -> SSR 어노말리 -> SR 프리 -> SR 센스 -> SR 로직 -> SR 어노말리` 순서로 나눈 JSON 파일입니다.
- `src/data/cards/supportCards.catalog.json`
  카드 그룹 카탈로그입니다.
- `src/data/cards/ownedSupportCards.example.json`
  보유 카드와 돌파 현황 업로드 예시 파일입니다.
- `src/data/schemas`
  JSON 스키마 초안입니다.
- `src/domain`
  타입, 점수 계산, 추천 탐색 로직입니다.
- `src/components`
  추천 화면, 결과 화면, 보유 카드 업로드 UI입니다.
- `src/app`
  Next.js 페이지 진입점입니다.

## 실행 방법

### 방법 1. 배치 파일로 실행하기

루트 폴더의 `run-dev.bat` 파일을 더블클릭하면 개발 서버가 실행됩니다.

실행 후 브라우저에서 아래 주소를 열면 됩니다.

- 메인 화면: `http://localhost:3000`
- 보유 카드 업로드 화면: `http://localhost:3000/collection`

### 방법 2. PowerShell에서 실행하기

```powershell
cd C:\che1\01_code\gakumas_calc
npm run dev
```

그다음 브라우저에서 아래 주소를 열면 됩니다.

```text
http://localhost:3000
```

## 컴퓨터를 껐다 켠 뒤 다시 확인하는 방법

1. PowerShell을 엽니다.
2. 아래 명령으로 프로젝트 폴더로 이동합니다.

```powershell
cd C:\che1\01_code\gakumas_calc
```

3. 아래 명령으로 개발 서버를 실행합니다.

```powershell
npm run dev
```

4. 브라우저에서 `http://localhost:3000` 을 엽니다.

배치 파일을 쓰고 싶다면 `run-dev.bat`만 더블클릭하면 됩니다.

## 처음 한 번 확인하면 좋은 것

아래 명령으로 Node.js와 npm이 정상 설치되어 있는지 확인할 수 있습니다.

```powershell
node -v
npm -v
```

만약 의존성 오류가 나면 아래 명령을 한 번 실행하면 됩니다.

```powershell
npm install
```

## 메모

- 현재 일부 카드 데이터는 구조 검증과 MVP 추천 흐름 확인을 위한 임시 입력이 섞여 있습니다.
- 실제 카드명, 이벤트 문구, 효과 수치는 위키 본문 대조를 거쳐 계속 보정할 예정입니다.
- 시험 점수 가정은 카드 로직이 아니라 정책 JSON에서 바꾸도록 분리돼 있습니다.
- 추후에는 보유 카드와 돌파 단계가 추천 엔진에 더 직접적으로 반영되도록 확장할 수 있습니다.
