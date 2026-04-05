export function formatPredictedScore(result: { totalScore: number }): string {
  return result.totalScore.toFixed(1);
}

// TODO: 스테이지별 점수 상한이나 실제 시험 시뮬레이터가 도입되면
// 결과 정규화 로직을 더 풍부하게 확장한다.
