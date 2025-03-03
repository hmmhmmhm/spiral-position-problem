import "./main.css";
import { createRoot } from "react-dom/client";
import SpiralViewer from "./components/spiral-viewer";
import { useEffect } from "react";
import { getCoordinates, getNFromCoordinates } from "./lib/gcode/spiral";
import {
  calculateCoordinateDiff,
  reconstructCoordinateDiff,
} from "./lib/gcode/spherical";
import { encode } from "./lib/gcode";

declare let window: any;

function App() {
  // Expose coordinates function
  useEffect(() => {
    window.getCoordinates = getCoordinates;
    window.getNFromCoordinates = getNFromCoordinates;
    window.calculateCoordinateDiff = calculateCoordinateDiff;
    window.reconstructCoordinateDiff = reconstructCoordinateDiff;
    window.encode = encode;
  }, []);

  return (
    <div className="min-h-screen bg-black p-4">
      <SpiralViewer />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
