import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Lessons from "./pages/Lessons";
import LessonDetail from "./pages/LessonDetail";
import Simulations from "./pages/Simulations";
import SimulationDetail from "./pages/SimulationDetail";
import Ethics from "./pages/Ethics";
import EthicsDetail from "./pages/EthicsDetail";
import AIChat from "./pages/AIChat";
import Analytics from "./pages/Analytics";
import Projects from "./pages/Projects";
import Profile from "./pages/Profile";
import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/lessons/:id" element={<LessonDetail />} />
            <Route path="/simulations" element={<Simulations />} />
            <Route path="/simulations/:id" element={<SimulationDetail />} />
            <Route path="/ethics" element={<Ethics />} />
            <Route path="/ethics/:id" element={<EthicsDetail />} />
            <Route path="/ai-chat" element={<AIChat />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Layout>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;