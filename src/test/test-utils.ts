import { getCoordinates } from "../lib/gcode/spiral";
import chalk from "chalk";

export const checkMaximumRange = ({
  n,
  precisionMeters = 3,
}: {
  n: number;
  precisionMeters?: number;
}) => {
  const { x, y } = getCoordinates(n);

  let max = Math.max(
    Math.abs(x * precisionMeters),
    Math.abs(y * precisionMeters)
  );

  const unit = max >= 1000 ? "km" : "m";
  return `${(max * (max >= 1000 ? 0.001 : 1)).toFixed(1)}${unit}`;
};

export const printMaximumRange = ({
  base,
  precisionMeters,
  length = 12,
}: {
  base: number;
  precisionMeters: number;
  length: number;
}) => {
  console.log("\n");
  console.log(
    chalk.green.bold(
      `Maximum representable distance per digit position in base-${base} with ${precisionMeters}m precision.`
    )
  );
  console.table(
    Object.fromEntries(
      Array.from({ length }, (_, i) => [
        `${i + 1} length ${formatNumber(
          Math.floor(Math.random() * (base ** (i + 1) - base ** i)) + base ** i,
          base
        )}`,
        chalk.green(checkMaximumRange({ n: base ** (i + 1), precisionMeters })),
      ])
    )
  );
  console.log("\n");
};

/**
 * 6자리 이상의 숫자를 4자리씩 띄어쓰기로 구분하여 반환하는 함수
 * @param num - 포맷팅할 숫자
 * @returns 띄어쓰기가 적용된 문자열, 6자리 미만일 경우 원본 숫자를 문자열로 반환
 *
 * @example
 * formatNumber(123456) // returns "123 456"
 * formatNumber(123456781234) // returns "1234 5678 1234"
 * formatNumber(12345) // returns "12345"
 */
export function formatNumber(num: number, base = 10): string {
  if (base > 32) return "";

  const numStr = num.toString(base).toUpperCase();

  // 6자리 미만이면 그대로 반환
  if (numStr.length < 6) {
    return `(e.g: ${numStr})`;
  }

  // 3자리면 3자리씩 그룹화
  if (numStr.length < 9) {
    return `(e.g: ${numStr.slice(0, 3)} ${numStr.slice(3)})`;
  }

  // 9자리는 3글자씩 그룹화
  if (numStr.length === 9) {
    return `(e.g: ${
      numStr.slice(0, 3) + " " + numStr.slice(3, 6) + " " + numStr.slice(6)
    })`;
  }

  // 뒤에서부터 4자리씩 그룹화
  const groups: string[] = [];
  let remaining = numStr;

  while (remaining.length > 0) {
    if (remaining.length <= 4) {
      groups.unshift(remaining);
      break;
    }

    groups.unshift(remaining.slice(-4));
    remaining = remaining.slice(0, -4);
  }

  return `(e.g: ${groups.join(" ")})`;
}
