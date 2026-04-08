import React from "react";
import HomePage from "./pages/homePage";
import MainLayout from "./components/layout/mainLayout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import StudentPage from "./pages/StudentPage";
import SignInPage from "./pages/SignInPage";
import RegisterPage from "./pages/RegisterPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/student" element={<StudentPage />} />
        </Route>
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
