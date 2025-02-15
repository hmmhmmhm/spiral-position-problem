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
