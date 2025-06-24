import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")).render(
  <HashRouter>
    <Toaster position="bottom-right" richColors />
    <App />
  </HashRouter>
);
