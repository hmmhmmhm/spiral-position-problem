// x^2 + y^2 <= m 인 격자점 개수 계산
function s(m: number): number {
  if (m < 0) return 0;
  const r = Math.floor(Math.sqrt(m));
  let count = 0;
  for (let x = 0; x <= r; x++) {
    const temp = m - x * x;
    if (temp < 0) continue;
    const k = Math.floor(Math.sqrt(temp));
    count += (x === 0 ? 1 : 2) * (2 * k + 1);
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

// 두 점의 각도 비교 (atan2 대신 외적 사용)
function isAngleGreater(px: number, py: number, x: number, y: number): boolean {
  const atan2A = Math.atan2(py, px);
  const atan2B = Math.atan2(y, x);
  if (atan2A === atan2B) return false;
  return atan2A > atan2B;
}

// 최적화된 getNFromCoordinates 함수
export const getNFromCoordinates = (x: number, y: number): number => {
  if (x === 0 && y === 0) return 1;

  const m = x * x + y * y;
  const s_m_minus_1 = m > 0 ? s(m - 1) : 0;

  const points = getPoints(m);
  let count = 0;
  for (const [px, py] of points) {
    if (isAngleGreater(px, py, x, y)) count++;
  }
  const k = count + 1;

  return s_m_minus_1 + k;
};
