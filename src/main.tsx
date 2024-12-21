import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./presentation/pages/Home";
import Room from "./presentation/pages/Room";
import EnterName from "./presentation/pages/EnterName";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomCode" element={<Room />} />
        <Route path="/enter-name/:roomCode" element={<EnterName />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
