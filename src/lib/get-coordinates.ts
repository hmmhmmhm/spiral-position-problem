// x^2 + y^2 <= m 인 격자점 개수 계산 (최적화 버전)
function s(m: number): number {
  if (m < 0) return 0;
  const r = Math.floor(Math.sqrt(m));
  let count = 0;
  for (let x = 0; x <= r; x++) {
    // 대칭성 활용, x >= 0만 계산
    const temp = m - x * x;
    if (temp < 0) continue;
    const k = Math.floor(Math.sqrt(temp));
    count += (x === 0 ? 1 : 2) * (2 * k + 1); // x=0은 1배, 나머지는 2배
  }
  return count;
}

// x^2 + y^2 = m 인 점 목록 생성
function getPoints(m: number): [number, number][] {
  const points: [number, number][] = [];
  const r = Math.floor(Math.sqrt(m));
  for (let x = -r; x <= r; x++) {
    const temp = m - x * x;
    if (temp < 0) continue;
    const k = Math.floor(Math.sqrt(temp));
    if (k * k === temp) {
      if (k > 0) {
        points.push([x, k]);
        points.push([x, -k]);
      } else {
        points.push([x, 0]);
      }
    }
  }
  return points;
}

export const getCoordinates = (n: number): { x: number; y: number } => {
  if (n <= 0) throw new Error("잘못된 n 값입니다.");
  if (n === 1) return { x: 0, y: 0 };

  // 근사적 m 추정
  const approx_m = Math.floor(n / Math.PI);
  const delta = Math.ceil(Math.sqrt(n)); // 탐색 범위 제한

  let low = Math.max(0, approx_m - delta);
  let high = approx_m + delta;

  // 이진 탐색으로 s(m) >= n 인 최소 m 찾기
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (s(mid) < n) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  const m = low;

  // s(m-1) 계산
  const s_m_minus_1 = m > 0 ? s(m - 1) : 0;
  const k = n - s_m_minus_1;

  // x^2 + y^2 = m 인 점 목록 생성
  const points = getPoints(m);

  // 각도 내림차순 정렬 (시계방향)
  points.sort((a, b) => {
    const angleA = Math.atan2(a[1], a[0]);
    const angleB = Math.atan2(b[1], b[0]);
    return angleB - angleA; // 시계방향으로 정렬
  });

  // k번째 점 반환
  const [x, y] = points[k - 1];
  return { x, y };
};
