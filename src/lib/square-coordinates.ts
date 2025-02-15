export const getCoordinates = (n: number): { x: number; y: number } => {
  if (n === 1) return { x: 0, y: 0 };

  // 레이어 계산 (O(1))
  const r = Math.ceil((Math.sqrt(n) - 1) / 2);

  // 레이어별 시작점과 길이
  const sideLength = 2 * r;
  const start = (2 * r - 1) ** 2 + 1;

  // 현재 위치 계산
  const posInLayer = n - start;
  const side = Math.floor(posInLayer / sideLength); // 0~3 (동,북,서,남)
  const posInSide = posInLayer % sideLength;

  // 각 변에 따른 좌표 계산
  switch (side) {
    case 0: // 동쪽 변 (x 증가)
      return { x: r, y: -r + posInSide + 1 };
    case 1: // 북쪽 변 (y 증가)
      return { x: r - posInSide - 1, y: r };
    case 2: // 서쪽 변 (x 감소)
      return { x: -r, y: r - posInSide - 1 };
    default: // 남쪽 변 (y 감소)
      return { x: -r + posInSide + 1, y: -r };
  }
};
