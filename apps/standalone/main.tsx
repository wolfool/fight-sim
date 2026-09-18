import { createRoot } from "react-dom/client";
import SimulatorApp from "../web/components/SimulatorApp";
import "../web/app/globals.css";

const el = document.getElementById("root");
if (el) {
  createRoot(el).render(<SimulatorApp />);
}
