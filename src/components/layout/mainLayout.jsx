import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../SideBar";
import NavBar from "../Navbar";

const MainLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <SideBar/>
      <main className="flex-1 ">
        <NavBar />
        <Outlet/>
      </main>
    </div>
  );
};

export default MainLayout;
