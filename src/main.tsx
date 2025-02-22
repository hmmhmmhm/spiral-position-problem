import "./main.css";
import { createRoot } from "react-dom/client";
import CoordinateVisualizer from "./components/coordinate-visualizer";

function App() {
  return (
    <div className="min-h-screen bg-black p-4">
      <CoordinateVisualizer />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
