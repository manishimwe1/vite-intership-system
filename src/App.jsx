import React from "react";
import HomePage from "./pages/homePage";
import MainLayout from "./components/layout/mainLayout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import StudentPage from "./pages/StudentPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/student" element={<StudentPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
