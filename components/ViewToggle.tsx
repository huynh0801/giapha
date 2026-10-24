"use client";

import { motion } from "framer-motion";
import { Circle, List, ListTree, Network } from "lucide-react";
import { useDashboard } from "./DashboardContext";

export type ViewMode = "list" | "tree" | "mindmap" | "bubble";

export default function ViewToggle() {
  const { view: currentView, setView } = useDashboard();

  const tabs = [
    {
      id: "list",
      label: "Danh sách",
      icon: <List className="size-5 sm:size-4" />,
    },
    {
      id: "tree",
      label: "Sơ đồ cây",
      icon: <Network className="size-5 sm:size-4" />,
    },
    {
      id: "mindmap",
      label: "Mindmap",
      icon: <ListTree className="size-5 sm:size-4" />,
    },
    {
      id: "bubble",
      label: "Bong bóng",
      icon: <Circle className="size-5 sm:size-4" />,
    },
  ] as const;

  return (
    <div className="relative z-10 mx-auto mb-3 mt-3 flex w-fit rounded-full border-2 border-[#deb887]/80 bg-[#fffdf7] p-1.5 shadow-xs backdrop-blur-sm">
      {tabs.map((tab) => {
        const isActive = currentView === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setView(tab.id as ViewMode)}
            className={`relative z-10 flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-bold transition-colors duration-200 sm:px-5 sm:py-2 ${
              isActive
                ? "text-white"
                : "text-[#7a6455] hover:text-[#183b28]"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 z-[-1] rounded-full bg-gradient-to-r from-[#8c1d1d] to-[#6e1616] border border-[#6e1616] shadow-xs"
                transition={{ type: "spring", stiffness: 450, damping: 30 }}
              />
            )}
            <span
              className={`transition-colors duration-200 ${
                isActive ? "text-white" : "text-[#caa455]"
              }`}
            >
              {tab.icon}
            </span>
            <span className="hidden tracking-wide sm:block">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
