// import { useState, useEffect } from 'react';
// import {
//   Activity,
//   Stethoscope,
//   ShieldCheck,
//   Lock,
//   HeartPulse,
// } from 'lucide-react';
// import PatientPortal from '@/components/PatientPortal';
// import DoctorViewer from '@/components/DoctorViewer';

// type Tab = 'portal' | 'viewer';

// function getViewTokenFromPath(): { token: string; key: string } | null {
//   const path = window.location.pathname;
//   const match = path.match(/^\/view\/([^/]+)$/);
//   if (!match) return null;

//   const token = match[1];
//   const hash = window.location.hash.replace(/^#/, '');
//   if (!hash) return null;

//   return { token, key: hash };
// }

// export default function App() {
//   const [activeTab, setActiveTab] = useState<Tab>('portal');
//   const [viewData, setViewData] = useState<{ token: string; key: string } | null>(null);

//   useEffect(() => {
//     const data = getViewTokenFromPath();
//     if (data) {
//       setViewData(data);
//       setActiveTab('viewer');
//     }

//     const onPopState = () => {
//       const d = getViewTokenFromPath();
//       if (d) {
//         setViewData(d);
//         setActiveTab('viewer');
//       } else {
//         setViewData(null);
//         setActiveTab('portal');
//       }
//     };

//     window.addEventListener('popstate', onPopState);
//     return () => window.removeEventListener('popstate', onPopState);
//   }, []);

//   const handleTabChange = (tab: Tab) => {
//     if (tab === 'portal') {
//       window.history.pushState({}, '', '/');
//       setViewData(null);
//     }
//     setActiveTab(tab);
//   };

//   return (
//     <div className="min-h-screen bg-slate-950 text-slate-200">
//       {/* Ambient background */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
//         <div className="absolute top-1/2 -left-40 w-96 h-96 bg-emerald-500/3 rounded-full blur-3xl" />
//         <div
//           className="absolute inset-0 opacity-[0.015]"
//           style={{
//             backgroundImage:
//               'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
//             backgroundSize: '48px 48px',
//           }}
//         />
//       </div>

//       {/* Header */}
//       <header className="relative border-b border-slate-800/60 bg-slate-900/40 backdrop-blur-xl sticky top-0 z-40">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6">
//           <div className="flex items-center justify-between h-16">
//             {/* Logo */}
//             <div className="flex items-center gap-2.5">
//               <div className="relative">
//                 <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
//                   <HeartPulse className="w-5 h-5 text-slate-950" />
//                 </div>
//                 <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse-glow" />
//               </div>
//               <div>
//                 <h1 className="text-lg font-bold text-slate-100 leading-none">
//                   Pulse<span className="text-emerald-400">Lock</span>
//                 </h1>
//                 <p className="text-[10px] text-slate-500 leading-none mt-0.5">
//                   Zero-Knowledge Medical Encryption
//                 </p>
//               </div>
//             </div>

//             {/* Status indicator */}
//             <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
//               <div className="flex items-center gap-1.5">
//                 <Lock className="w-3.5 h-3.5 text-emerald-400" />
//                 <span>AES-GCM 256-bit</span>
//               </div>
//               <div className="w-px h-4 bg-slate-700" />
//               <div className="flex items-center gap-1.5">
//                 <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
//                 <span>Client-side Encrypted</span>
//               </div>
//             </div>
//           </div>

//           {/* Tab bar */}
//           <nav className="flex gap-1 -mb-px">
//             <TabButton
//               active={activeTab === 'portal'}
//               onClick={() => handleTabChange('portal')}
//               icon={<Activity className="w-4 h-4" />}
//               label="Patient Portal"
//             />
//             <TabButton
//               active={activeTab === 'viewer'}
//               onClick={() => {
//                 if (!viewData) {
//                   // If no token in URL, just show a placeholder viewer tab
//                   setActiveTab('viewer');
//                 }
//               }}
//               icon={<Stethoscope className="w-4 h-4" />}
//               label="Doctor Secure Viewer"
//             />
//           </nav>
//         </div>
//       </header>

//       {/* Main content */}
//       <main className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8">
//         {activeTab === 'portal' && <PatientPortal />}

//         {activeTab === 'viewer' &&
//           (viewData ? (
//             <DoctorViewer token={viewData.token} keyBase64={viewData.key} />
//           ) : (
//             <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fade-in">
//               <div className="w-20 h-20 rounded-2xl bg-slate-800/60 flex items-center justify-center border border-slate-700/50 mb-6">
//                 <Stethoscope className="w-10 h-10 text-slate-500" />
//               </div>
//               <h2 className="text-xl font-semibold text-slate-300 mb-2">
//                 Doctor Secure Viewer
//               </h2>
//               <p className="text-slate-500 max-w-md text-center text-sm">
//                 This tab displays shared medical documents. Open a secure share
//                 link (format:{' '}
//                 <code className="font-mono text-emerald-400 text-xs">
//                   /view/&#123;token&#125;#&#123;key&#125;
//                 </code>
//                 ) to view an encrypted document.
//               </p>
//               <div className="mt-6 p-4 rounded-xl bg-slate-800/40 border border-slate-700/40 max-w-md">
//                 <div className="flex items-start gap-2.5">
//                   <Lock className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
//                   <p className="text-xs text-slate-400">
//                     Documents are decrypted entirely in your browser using the
//                     encryption key from the URL hash fragment. The key never
//                     touches the server.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))}
//       </main>

//       {/* Footer */}
//       <footer className="relative border-t border-slate-800/60 mt-12">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
//           <div className="flex items-center justify-between flex-wrap gap-3 text-xs text-slate-500">
//             <div className="flex items-center gap-2">
//               <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/60" />
//               <span>
//                 PulseLock — Zero-knowledge encrypted medical document sharing
//               </span>
//             </div>
//             <div className="flex items-center gap-4">
//               <span>Web Crypto API</span>
//               <span>AES-GCM 256-bit</span>
//               <span>Client-side Encryption</span>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// function TabButton({
//   active,
//   onClick,
//   icon,
//   label,
// }: {
//   active: boolean;
//   onClick: () => void;
//   icon: React.ReactNode;
//   label: string;
// }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`
//         flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all duration-200
//         ${
//           active
//             ? 'border-emerald-500 text-emerald-400'
//             : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
//         }
//       `}
//     >
//       {icon}
//       {label}
//     </button>
//   );
// }

import React, { useEffect, useState } from "react";
import { Shield } from "lucide-react";
import { PatientPortal } from "./components/PatientPortal";
import { DoctorViewer } from "./components/DoctorViewer";

interface DoctorSessionState {
  token: string;
  key: string;
}

export function App() {
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-linear-to-tr from-emerald-500 to-cyan-500 rounded-xl text-slate-950">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                PulseLock
              </span>
              <span className="text-[10px] ml-2 font-mono text-slate-400 uppercase tracking-wider">
                Zero-Knowledge EHR
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-950/60 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Zero-Trust Protocol Active</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full">
        <PatientPortal />
      </main>

      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-400 font-mono">
        PulseLock • Client-Side AES-256-GCM • Ephemeral Hash Sharing • HMAC
        Merkle Audit Chain
      </footer>
    </div>
  );
}

export default App;