// import React, { useEffect, useState } from "react";
// import { Shield, Home, LayoutDashboard } from "lucide-react";
// import { PatientPortal } from "./components/PatientPortal";
// import { DoctorViewer } from "./components/DoctorViewer";
// import { LandingPage } from "./components/LandingPage";

// interface DoctorSessionState {
//   token: string;
//   key: string;
// }

// export function App() {
//   const [currentView, setCurrentView] = useState<"home" | "portal">("home");
//   const [doctorSession, setDoctorSession] = useState<DoctorSessionState | null>(
//     null,
//   );

//   useEffect(() => {
//     const hash = window.location.hash.substring(1);
//     if (hash) {
//       const params = new URLSearchParams(hash);
//       const token = params.get("token");
//       const key = params.get("key");

//       if (token && key) {
//         setDoctorSession({ token, key });
//       }
//     }
//   }, []);

//   if (doctorSession) {
//     return (
//       <DoctorViewer
//         token={doctorSession.token}
//         encryptionKey={doctorSession.key}
//       />
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
//       <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
//         <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
//           <div
//             onClick={() => setCurrentView("home")}
//             className="flex items-center space-x-3 cursor-pointer"
//           >
//             <div className="p-2 bg-linear-to-tr from-emerald-500 to-cyan-500 rounded-xl text-slate-950">
//               <Shield className="w-5 h-5" />
//             </div>
//             <div>
//               <span className="font-bold text-lg tracking-tight bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
//                 PulseLock
//               </span>
//               <span className="text-[10px] ml-2 font-mono text-slate-400 uppercase tracking-wider">
//                 Zero-Knowledge EHR
//               </span>
//             </div>
//           </div>

//           <div className="flex items-center space-x-3">
//             <button
//               onClick={() => setCurrentView("home")}
//               className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
//                 currentView === "home"
//                   ? "bg-slate-800 text-slate-100 border border-slate-700"
//                   : "text-slate-400 hover:text-slate-200"
//               }`}
//             >
//               <Home className="w-3.5 h-3.5" />
//               <span>Home</span>
//             </button>

//             <button
//               onClick={() => setCurrentView("portal")}
//               className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
//                 currentView === "portal"
//                   ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
//                   : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold"
//               }`}
//             >
//               <LayoutDashboard className="w-3.5 h-3.5" />
//               <span>
//                 {currentView === "portal" ? "Vault Active" : "Open Vault"}
//               </span>
//             </button>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full">
//         {currentView === "home" ? (
//           <LandingPage onEnterApp={() => setCurrentView("portal")} />
//         ) : (
//           <PatientPortal />
//         )}
//       </main>

//       <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-400 font-mono">
//         PulseLock • Client-Side AES-256-GCM • Ephemeral Hash Sharing • HMAC
//         Merkle Audit Chain
//       </footer>
//     </div>
//   );
// }

// export default App;

import React, { useEffect, useState } from "react";
import { Navbar } from "./components/Navbar";
import { PatientPortal } from "./components/PatientPortal";
import { DoctorViewer } from "./components/DoctorViewer";
import { LandingPage } from "./components/LandingPage";

interface DoctorSessionState {
  token: string;
  key: string;
}

export function App() {
  const [currentView, setCurrentView] = useState<"home" | "portal">("home");
  const [doctorSession, setDoctorSession] = useState<DoctorSessionState | null>(
    null,
  );

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      const params = new URLSearchParams(hash);
      const token = params.get("token");
      const key = params.get("key");

      if (token && key) {
        setDoctorSession({ token, key });
      }
    }
  }, []);

  if (doctorSession) {
    return (
      <DoctorViewer
        token={doctorSession.token}
        encryptionKey={doctorSession.key}
      />
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-zinc-800">
      <Navbar currentView={currentView} onSelectView={setCurrentView} />

      <main className="max-w-6xl mx-auto px-6 py-8 flex-1 w-full">
        {currentView === "home" ? (
          <LandingPage onEnterApp={() => setCurrentView("portal")} />
        ) : (
          <PatientPortal />
        )}
      </main>

      <footer className="border-t border-zinc-900 py-6 text-center text-[10px] text-zinc-600 font-mono tracking-widest uppercase">
        PULSELOCK PROTOCOL // CLIENT-SIDE WEB CRYPTO // ZERO SERVER RETENTION
      </footer>
    </div>
  );
}

export default App;