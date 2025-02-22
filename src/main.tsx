import "./main.css";
import { createRoot } from "react-dom/client";
import SpiralViewer from "./components/spiral-viewer";

function App() {
  return (
    <div className="min-h-screen bg-black p-4">
      <SpiralViewer />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
