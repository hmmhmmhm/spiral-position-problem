# 나선형 원형 좌표계 변환 알고리즘 테스트베드

![Image](https://pbs.twimg.com/media/GkRclL2WwAAJmwy?format=jpg&name=large)

> [상세 트위터 설명](https://x.com/hmmhmm_hm/status/1890693943710396921)

## 프로젝트 개요

본 프로젝트는 나선형 증가 패턴을 따르는 원형 좌표계에서의 위치 계산 알고리즘을 O(log N) 시간 복잡도로 구현하기 위한 테스트베드입니다. 주요 기능으로는:

- 계층적 레이어 분할을 통한 효율적인 좌표 계산
- 실시간 시각화 인터페이스 제공
- 다층 구조 색상 구분 시스템

## 현재 직면한 문제

알고리즘의 성능이 O(sqrt(N) log N) 시간 복잡도로 구현되어 있습니다. 이를 좀 더 개선 가능하면 좋습니다.

## 핵심 알고리즘

- `lib/get-coordinates.ts`
- `lib/get-n-from-coordinates.ts`

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

## 실험 명령어

- npx tsx src/data/generate-words.ts
- npx tsx src/data/refine-words.ts
- npx tsx src/data/analyze-words.ts
