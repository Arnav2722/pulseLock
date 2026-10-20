// import React, { useEffect, useState } from "react";
// import {
//   Unlock,
//   Clock,
//   AlertOctagon,
//   Loader2,
//   ShieldAlert,
// } from "lucide-react";
// import { importKeyFromBase64, decryptFile } from "../lib/crypto";
// import { DecryptedDocumentPayload } from "../types";

// interface DoctorViewerProps {
//   token: string;
//   encryptionKey: string;
// }

// export const DoctorViewer: React.FC<DoctorViewerProps> = ({
//   token,
//   encryptionKey,
// }) => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [docData, setDocData] = useState<DecryptedDocumentPayload | null>(null);
//   const [blobUrl, setBlobUrl] = useState<string | null>(null);
//   const [secondsRemaining, setSecondsRemaining] = useState<number>(0);

//   // 1. Decrypt locally in memory
//   useEffect(() => {
//     let activeBlob: string | null = null;

//     async function fetchAndDecrypt() {
//       try {
//         const res = await fetch(`http://localhost:8000/api/record/${token}`);
//         if (!res.ok) {
//           if (res.status === 403) throw new Error("ACCESS_EXPIRED");
//           throw new Error("INVALID_TOKEN");
//         }
//         const data: DecryptedDocumentPayload = await res.json();
//         setDocData(data);
//         setSecondsRemaining(data.time_remaining_seconds || 60);

//         const cryptoKey = await importKeyFromBase64(encryptionKey);
//         const decryptedBuffer = await decryptFile(
//           data.ciphertext,
//           data.iv,
//           cryptoKey,
//         );

//         const mime = data.file_type || "application/pdf";
//         const blob = new Blob([decryptedBuffer], { type: mime });
//         activeBlob = URL.createObjectURL(blob);
//         setBlobUrl(activeBlob);
//       } catch (err: unknown) {
//         const message = err instanceof Error ? err.message : "";
//         if (message === "ACCESS_EXPIRED") {
//           setError("Access window has expired. Records permanently sealed.");
//         } else {
//           setError("Invalid or corrupted access pass.");
//         }
//       } finally {
//         setLoading(false);
//       }
//     }

//     if (token && encryptionKey) {
//       fetchAndDecrypt();
//     } else {
//       setError("Missing token or decryption key in URL.");
//       setLoading(false);
//     }

//     return () => {
//       if (activeBlob) {
//         URL.revokeObjectURL(activeBlob);
//       }
//     };
//   }, [token, encryptionKey]);

//   // 2. Memory Purge on timer zero
//   useEffect(() => {
//     if (secondsRemaining <= 0 && blobUrl) {
//       URL.revokeObjectURL(blobUrl);
//       setBlobUrl(null);
//       setError("Session expired. Local memory purged.");
//       return;
//     }

//     const interval = setInterval(() => {
//       setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [secondsRemaining, blobUrl]);

//   // 3. Block Right-Click, Print, Save shortcuts
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       // Ctrl+S or Cmd+S (Save)
//       if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
//         e.preventDefault();
//         alert("Downloading is disabled by Patient Privacy Policy.");
//       }
//       // Ctrl+P or Cmd+P (Print)
//       if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
//         e.preventDefault();
//         alert("Printing is restricted on ephemeral medical records.");
//       }
//     };

//     const handleContextMenu = (e: MouseEvent) => {
//       e.preventDefault();
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     window.addEventListener("contextmenu", handleContextMenu);

//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//       window.removeEventListener("contextmenu", handleContextMenu);
//     };
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200">
//         <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mb-3" />
//         <p className="text-sm font-medium">
//           Validating token & decrypting record in memory...
//         </p>
//       </div>
//     );
//   }

//   if (error || !blobUrl) {
//     return (
//       <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 select-none">
//         <div className="max-w-md w-full bg-slate-900 border border-red-500/30 rounded-2xl p-8 text-center shadow-2xl">
//           <div className="w-14 h-14 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto text-red-400 mb-4">
//             <AlertOctagon className="w-8 h-8" />
//           </div>
//           <h2 className="text-lg font-bold text-slate-100 mb-2">
//             Access Terminated
//           </h2>
//           <p className="text-xs text-slate-400 leading-relaxed mb-6">{error}</p>
//           <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 font-mono">
//             Zero-knowledge session wiped from browser RAM.
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Disable browser PDF download toolbar
//   const securePdfUrl = `${blobUrl}#toolbar=0&navpanes=0&scrollbar=0`;

//   return (
//     <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col select-none">
//       {/* Header */}
//       <header className="bg-slate-900/90 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
//         <div className="flex items-center space-x-3">
//           <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
//             <Unlock className="w-5 h-5" />
//           </div>
//           <div>
//             <h2 className="text-sm font-semibold text-slate-100">
//               {docData?.filename}
//             </h2>
//             <p className="text-xs text-slate-400">
//               Consultation Session: {docData?.doctor_alias || "Doctor"}
//             </p>
//           </div>
//         </div>

//         <div className="flex items-center space-x-4">
//           <div className="flex items-center gap-1.5 px-3 py-1 bg-red-950/50 border border-red-500/30 text-red-400 text-xs rounded-xl font-mono">
//             <ShieldAlert className="w-3.5 h-3.5" />
//             <span>Download Disabled</span>
//           </div>
//           <div className="flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 font-mono text-xs">
//             <Clock className="w-4 h-4 animate-pulse" />
//             <span>
//               Time Left: {Math.floor(secondsRemaining / 60)}:
//               {String(secondsRemaining % 60).padStart(2, "0")}
//             </span>
//           </div>
//         </div>
//       </header>

//       {/* Viewer with Watermark Overlay */}
//       <main className="flex-1 p-6 flex flex-col items-center justify-center relative">
//         <div className="w-full max-w-4xl h-[75vh] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
//           {/* Dynamic Digital Watermark to prevent covert screen recording */}
//           <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-around items-center opacity-[0.06] select-none text-slate-100 font-mono text-xl rotate-[-25deg]">
//             <p>
//               CONFIDENTIAL • {docData?.doctor_alias?.toUpperCase() || "DOCTOR"}{" "}
//               • EPHEMERAL ACCESS
//             </p>
//             <p>PATIENT SOVEREIGN VAULT • NON-TRANSFERABLE</p>
//             <p>
//               CONFIDENTIAL • {docData?.doctor_alias?.toUpperCase() || "DOCTOR"}{" "}
//               • EPHEMERAL ACCESS
//             </p>
//           </div>

//           {docData?.file_type?.includes("image") ? (
//             <img
//               src={blobUrl}
//               alt="Medical Document"
//               className="w-full h-full object-contain p-4 select-none pointer-events-none"
//               onContextMenu={(e) => e.preventDefault()}
//             />
//           ) : (
//             <iframe
//               src={securePdfUrl}
//               className="w-full h-full border-0 select-none"
//               title="Medical Report"
//             />
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

import React, { useEffect, useState } from "react";
import { Loader2, AlertOctagon } from "lucide-react";
import { importKeyFromBase64, decryptFile } from "../lib/crypto";
import { DecryptedDocumentPayload } from "../types";

interface DoctorViewerProps {
  token: string;
  encryptionKey: string;
}

export const DoctorViewer: React.FC<DoctorViewerProps> = ({
  token,
  encryptionKey,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [docData, setDocData] = useState<DecryptedDocumentPayload | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);

  useEffect(() => {
    let activeBlob: string | null = null;

    async function fetchAndDecrypt() {
      try {
        const res = await fetch(`http://localhost:8000/api/record/${token}`);
        if (!res.ok) {
          if (res.status === 403) throw new Error("ACCESS_EXPIRED");
          throw new Error("INVALID_TOKEN");
        }
        const data: DecryptedDocumentPayload = await res.json();
        setDocData(data);
        setSecondsRemaining(data.time_remaining_seconds || 60);

        const cryptoKey = await importKeyFromBase64(encryptionKey);
        const decryptedBuffer = await decryptFile(
          data.ciphertext,
          data.iv,
          cryptoKey,
        );

        const mime = data.file_type || "application/pdf";
        const blob = new Blob([decryptedBuffer], { type: mime });
        activeBlob = URL.createObjectURL(blob);
        setBlobUrl(activeBlob);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "";
        if (message === "ACCESS_EXPIRED") {
          setError("Access window has expired. Records permanently sealed.");
        } else {
          setError("Invalid or corrupted access pass.");
        }
      } finally {
        setLoading(false);
      }
    }

    if (token && encryptionKey) {
      fetchAndDecrypt();
    } else {
      setError("Missing token or decryption key in URL.");
      setLoading(false);
    }

    return () => {
      if (activeBlob) {
        URL.revokeObjectURL(activeBlob);
      }
    };
  }, [token, encryptionKey]);

  useEffect(() => {
    if (secondsRemaining <= 0 && blobUrl) {
      URL.revokeObjectURL(blobUrl);
      setBlobUrl(null);
      setError("Session expired. Local memory purged.");
      return;
    }

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsRemaining, blobUrl]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        alert("Downloading disabled by sovereign patient policy.");
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
        e.preventDefault();
        alert("Printing restricted on ephemeral medical records.");
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("contextmenu", handleContextMenu);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-300 font-mono text-xs">
        <Loader2 className="w-5 h-5 text-emerald-400 animate-spin mb-3" />
        <p>DECRYPTING PAYLOAD IN IN-MEMORY SANDBOX...</p>
      </div>
    );
  }

  if (error || !blobUrl) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full border border-zinc-900 bg-zinc-950 p-8 text-center space-y-4">
          <div className="w-10 h-10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <h2 className="font-mono text-xs uppercase tracking-wider text-zinc-100">
            Access Terminated
          </h2>
          <p className="text-xs text-zinc-500 font-mono">{error}</p>
          <div className="p-3 bg-zinc-900 text-[10px] text-zinc-500 font-mono uppercase">
            RAM memory flushed via revokeObjectURL
          </div>
        </div>
      </div>
    );
  }

  const securePdfUrl = `${blobUrl}#toolbar=0&navpanes=0&scrollbar=0`;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-mono select-none">
      <header className="border-b border-zinc-900 bg-zinc-950 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        <div>
          <h2 className="text-xs font-semibold text-zinc-200">
            {docData?.filename}
          </h2>
          <p className="text-[10px] text-zinc-500 uppercase">
            Consultation: {docData?.doctor_alias || "Doctor"}
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <span className="text-[10px] text-red-400 border border-red-500/30 px-2 py-0.5 uppercase">
            No Download
          </span>
          <div className="text-[11px] text-amber-400 border border-zinc-800 px-2.5 py-1">
            Timer: {Math.floor(secondsRemaining / 60)}:
            {String(secondsRemaining % 60).padStart(2, "0")}
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 flex flex-col items-center justify-center relative">
        <div className="w-full max-w-4xl h-[75vh] border border-zinc-900 bg-zinc-950 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-around items-center opacity-[0.04] text-zinc-100 font-mono text-sm rotate-[-20deg]">
            <p>CONFIDENTIAL • EPHEMERAL PASS • NON-TRANSFERABLE</p>
            <p>CONFIDENTIAL • EPHEMERAL PASS • NON-TRANSFERABLE</p>
          </div>

          {docData?.file_type?.includes("image") ? (
            <img
              src={blobUrl}
              alt="Medical Document"
              className="w-full h-full object-contain p-4 pointer-events-none"
            />
          ) : (
            <iframe
              src={securePdfUrl}
              className="w-full h-full border-0"
              title="Medical Report"
            />
          )}
        </div>
      </main>
    </div>
  );
};