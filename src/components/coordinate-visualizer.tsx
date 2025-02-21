import { useState } from "react";
import PixelMap from "./pixel-map";
import { ScrollArea } from "./ui/scroll-area";
import { getCoordinates } from "@/lib/get-coordinates";
import { getNFromCoordinates } from "@/lib/get-n-from-coordinates";

const getLayerColor = (layer: number) => {
  // 흰색 기반 (불투명도로 구분)
  const opacity = Math.min(0.3 + layer * 0.07, 1.0); // 초기값 0.3에서 1.0까지 증가
  return `rgba(255, 255, 255, ${opacity})`;
};

export default function CoordinateVisualizer() {
  const [currentCoordinate, setCurrentCoordinate] = useState(1);
  const [coordinatesHistory, setCoordinatesHistory] = useState<number[]>([1]);
  const [highlightedCoordinate, setHighlightedCoordinate] = useState<
    number | null
  >(null);

  const handleCoordinateChange = (n: number) => {
    setCurrentCoordinate(n);
    setCoordinatesHistory(Array.from({ length: n }, (_, i) => i + 1));
  };

  const getCoordinateColor = (n: number) => {
    const baseColor = getLayerColor(Math.ceil((Math.sqrt(n) - 1) / 2));
    if (highlightedCoordinate === n) {
      return "rgba(0, 255, 0, 0.8)"; // 하이라이트된 좌표는 녹색으로 표시
    }
    return baseColor;
  };

  return (
    <div className="min-h-screen p-4">
      <div className="flex flex-col lg:flex-row lg:space-x-4 lg:h-[calc(100vh-2rem)]">
        <div className="w-full lg:w-1/2 bg-black rounded-lg shadow-lg p-4 flex-none">
          <PixelMap
            highlightCoordinates={coordinatesHistory.map((n) => ({
              coord: getCoordinates(n),
              color: getCoordinateColor(n),
            }))}
          />
        </div>

        <div className="w-full lg:w-1/2 flex flex-col mt-4 lg:mt-0">
          <div className="mb-4 text-white">
            <h2 className="text-xl font-bold mb-2">
              Spiral Coordinate Generator
            </h2>
            <p className="text-sm text-gray-300">
              This visualization demonstrates a unique spiral coordinate system
              that starts from (0,0) and expands outward in a clockwise pattern.
              Move the slider to generate coordinates from 1 to 100, and watch
              how they form concentric layers around the origin.
            </p>
          </div>
          <div className="relative mb-10">
            <input
              type="range"
              min={1}
              max={100}
              value={currentCoordinate}
              onChange={(e) => handleCoordinateChange(Number(e.target.value))}
              className="w-full h-3 mb-2 bg-black rounded-lg appearance-none cursor-pointer accent-white hover:accent-gray-300 focus:outline-none border border-white/20"
              style={{
                WebkitAppearance: "none",
                appearance: "none",
              }}
            />
            <div className="relative w-full h-6">
              <div className="absolute left-0 -top-1 w-full flex justify-between px-1">
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-2 bg-white/50"></div>
                  <span className="text-xs text-white/70">1</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-2 bg-white/50"></div>
                  <span className="text-xs text-white/70">25</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-2 bg-white/50"></div>
                  <span className="text-xs text-white/70">50</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-2 bg-white/50"></div>
                  <span className="text-xs text-white/70">75</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-2 bg-white/50"></div>
                  <span className="text-xs text-white/70">100</span>
                </div>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 h-[400px] lg:max-h-[calc(100vh-2rem)]">
            <div className="p-4 space-y-2">
              {[...coordinatesHistory].reverse().map((n) => (
                <div
                  key={n}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-white/10 rounded px-2 py-1"
                  onMouseEnter={() => setHighlightedCoordinate(n)}
                  onMouseLeave={() => setHighlightedCoordinate(null)}
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getCoordinateColor(n) }}
                  />
                  <div className="text-white">
                    <span className="font-mono">N={n}</span>
                    <span className="mx-2">→</span>
                    <span className="font-mono">
                      {JSON.stringify(getCoordinates(n))}
                    </span>
                    <span className="mx-2">→</span>
                    <span
                      className={`font-mono ${
                        (() => {
                          const coord = getCoordinates(n);
                          return getNFromCoordinates(coord.x, coord.y) === n;
                        })()
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      N'=
                      {(() => {
                        const coord = getCoordinates(n);
                        return getNFromCoordinates(coord.x, coord.y);
                      })()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
