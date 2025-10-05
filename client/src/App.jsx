// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import AlakhSir from "./components/AlakhSir";
import { AppContextProvider } from "./context/ContextApi";

function App() {
  return (
    <AppContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/alakh" element={<AlakhSir />} />
        </Routes>
      </Router>
    </AppContextProvider>
  );
}

export default App;
