import React from "react";

interface NavbarProps {
  currentView: "home" | "portal";
  onSelectView: (view: "home" | "portal") => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
}) => {
  return (
    <header className="border-b border-zinc-900 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <div
          onClick={() => onSelectView("home")}
          className="flex items-center space-x-3 cursor-pointer group select-none"
        >
          <span className="font-mono text-sm tracking-wider font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors">
            PULSE//LOCK
          </span>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-3 border-l border-zinc-800">
            ZERO-TRUST ARCHITECTURE
          </span>
        </div>

        <nav className="flex items-center space-x-1 font-mono text-xs">
          <button
            onClick={() => onSelectView("home")}
            className={`px-3 py-1.5 transition-colors cursor-pointer uppercase tracking-wider ${
              currentView === "home"
                ? "bg-zinc-900 text-zinc-100 border border-zinc-800"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => onSelectView("portal")}
            className={`px-3 py-1.5 transition-colors cursor-pointer uppercase tracking-wider ${
              currentView === "portal"
                ? "bg-zinc-100 text-zinc-950 font-semibold"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Vault Console
          </button>
        </nav>
      </div>
    </header>
  );
};
