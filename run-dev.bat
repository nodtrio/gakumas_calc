@echo off
chcp 65001 > nul
setlocal

cd /d C:\che1\01_code\gakumas_calc

echo ================================
echo gakumas_calc 개발 서버를 실행합니다.
echo ================================
echo.

echo [1/3] Node.js 확인 중...
where node > nul 2>nul
if errorlevel 1 (
  echo Node.js를 찾을 수 없습니다.
  echo Node.js 설치 후 다시 실행해 주세요.
  pause
  exit /b 1
)

echo [2/3] npm 확인 중...
where npm > nul 2>nul
if errorlevel 1 (
  echo npm을 찾을 수 없습니다.
  echo Node.js 설치가 제대로 되었는지 확인해 주세요.
  pause
  exit /b 1
)

echo [3/3] 브라우저를 열고 개발 서버를 시작합니다...
start "" http://localhost:3000

echo.
echo 개발 서버를 종료하려면 이 창에서 Ctrl+C를 누르세요.
echo 보유 카드 업로드 화면 주소: http://localhost:3000/collection
echo.

npm run dev

pause
