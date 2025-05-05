import { StrictMode } from "react";
import './main.css';
import { createRoot } from "react-dom/client";
import '@flaticon/flaticon-uicons/css/all/all.css'; // Import once

// import App from "@Container/index";
import App from "@Map/index";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
<App />
  </StrictMode>,
);
