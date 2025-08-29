// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import HorseList from "./pages/HorseList.jsx";
import HorseDetail from "./pages/HorceDetails.jsx";
import Weekly from "./pages/Weekly.jsx";
import RaceResults from "./pages/RaceResults.jsx";
import RaceResultsIndex from "./pages/RaceResultsIndex.jsx";
import CourseAnalysisIndex from "./pages/CourseAnalysisIndex.jsx";
import CourseDetail from "./pages/CourseDetail.jsx";
import "./App.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/weekly" element={<Weekly />} />
        <Route path="/weekly/:id" element={<Weekly />} />
        <Route path="/horse-analysis" element={<HorseList />} />
        <Route path="/horses/:id" element={<HorseDetail />} />
        <Route path="/race-results" element={<RaceResultsIndex />} />
        <Route path="/race-results/:id" element={<RaceResults />} />
        <Route path="/course-analysis" element={<CourseAnalysisIndex />} />
        <Route path="/course-analysis/:id" element={<CourseDetail />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
