# 나선형 원형 좌표계 변환 알고리즘 테스트베드

![Image](https://pbs.twimg.com/media/Gj0XWuzb0AAMH31?format=jpg&name=4096x4096)

> [상세 트위터 설명](https://x.com/hmmhmm_hm/status/1890693943710396921)

## 프로젝트 개요

본 프로젝트는 나선형 패턴을 따르는 원형 좌표계에서의 위치 계산 알고리즘을 O(log N) 시간 복잡도로 구현한 테스트베드입니다. 주요 기능으로는:

- 계층적 레이어 분할을 통한 효율적인 좌표 계산
- 실시간 시각화 인터페이스 제공
- 다층 구조 색상 구분 시스템

## 현재 직면한 문제

현재 좌표계 연산 로직의 가장 큰 문제점은 일부 n값에서 2개의 좌표가 겹치는 현상이 발생한다는 점입니다. 이 좌표 중복 문제만 해결하면 알고리즘이 완성됩니다.

## 핵심 알고리즘

`lib/circle-coordinates.ts`에 구현된 주요 로직:

```typescript
export function getCoordinates(n: number): { x: number; y: number } {
  if (n === 1) {
    return { x: 0, y: 0 };
  }

  // Determine the layer r using the quadratic formula
  const r = Math.ceil((Math.sqrt(n) - 1) / 2);
  const startOfLayer = (2 * r - 1) ** 2 + 1;
  const pos = n - startOfLayer;

  // Each layer has 8r points, divided into 8r angular steps
  const angleStep = (2 * Math.PI) / (8 * r);
  const angle = pos * angleStep;

  // Calculate coordinates using sine and cosine, rounded to nearest integer
  const x = Math.round(r * Math.cos(angle));
  const y = Math.round(r * Math.sin(angle));

  return { x, y };
}
```

## 시각화 시스템

`components/coordinate-visualizer.tsx`의 주요 기능:

- 실시간 좌표 트래킹
- 레이어 별 투명도 기반 색상 구분
- 역사적 좌표 표시 기능

## 설치 및 실행

```bash
bun install
bun dev
```
