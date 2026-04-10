import React from "react";
import HomePage from "./pages/homePage";
import MainLayout from "./components/layout/mainLayout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import StudentPage from "./pages/StudentPage";
import SignInPage from "./pages/SignInPage";
import RegisterPage from "./pages/RegisterPage";
import AddNewStudentPage from "./components/AddNewStudentPage";
import StudentIdPage from "./pages/StudentIdPage";
import AddCoursePage from "./pages/AddCoursePage";
import CourseDetailPage from "./pages/CourseDetailPage";
import EditCoursePage from "./pages/EditCoursePage";
import { ProtectedRoute } from "./components/ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student"
            element={
              <ProtectedRoute>
                <StudentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students/:id"
            element={
              <ProtectedRoute>
                <StudentIdPage />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/add-course"
          element={
            <ProtectedRoute>
              <AddCoursePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:id"
          element={
            <ProtectedRoute>
              <CourseDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-course/:id"
          element={
            <ProtectedRoute>
              <EditCoursePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
