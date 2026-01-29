import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./header/Header";
import { Sidebar } from "./sidebar/Sidebar";
import previousArrowIcon from "../shared/assets/previousArrowIcon.svg";
import nextArrowIcon from "../shared/assets/nextArrowIcon.svg";

export function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen w-full bg-background">
      <Header />

      <div className="relative flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-1/2 -translate-y-1/2 z-50 h-20 w-5 px-0.5 rounded-l-none rounded-r-sm border border-l-0 border-border bg-white/95 hover:bg-background-light shadow-sm transition-all duration-300 ease-in-out flex items-center justify-center"
          style={{
            left: isSidebarOpen ? "16rem" : "0",
          }}
          title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          aria-label={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
        >
          {isSidebarOpen ? (
            <img src={previousArrowIcon} alt="" className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <img src={nextArrowIcon} alt="" className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </button>
        <main className={`flex-1 overflow-y-auto pb-8 transition-all ${isSidebarOpen ? "" : ""}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}