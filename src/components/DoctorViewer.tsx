// import { useEffect, useRef, useState, useCallback } from 'react';
// import {
//   Lock,
//   ShieldX,
//   Loader2,
//   FileText,
//   ImageIcon,
//   Timer,
//   Eye,
//   AlertTriangle,
//   Download,
// } from 'lucide-react';
// import { fetchRecord, AccessDeniedError } from '@/lib/api';
// import { decryptFile, detectMimeType, type DecryptionResult } from '@/lib/crypto';
// import type { RecordResponse } from '@/lib/api';

// type ViewerState = 'loading' | 'decrypted' | 'expired' | 'error';

// interface DoctorViewerProps {
//   token: string;
//   keyBase64: string;
// }

// function formatTime(seconds: number): string {
//   if (seconds <= 0) return '0:00';
//   const mins = Math.floor(seconds / 60);
//   const secs = seconds % 60;
//   if (mins >= 1) {
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   }
//   return `${secs}s`;
// }

// export default function DoctorViewer({ token, keyBase64 }: DoctorViewerProps) {
//   const [state, setState] = useState<ViewerState>('loading');
//   const [errorMsg, setErrorMsg] = useState('');
//   const [remaining, setRemaining] = useState(0);
//   const [docInfo, setDocInfo] = useState<{ filename: string; mimeType: string } | null>(null);
//   const blobUrlRef = useRef<string | null>(null);

//   const clearBlob = useCallback(() => {
//     if (blobUrlRef.current) {
//       URL.revokeObjectURL(blobUrlRef.current);
//       blobUrlRef.current = null;
//     }
//   }, []);

//   useEffect(() => {
//     let cancelled = false;

//     const load = async () => {
//       try {
//         const record: RecordResponse = await fetchRecord(token);

//         if (cancelled) return;

//         const decrypted = await decryptFile(
//           record.ciphertext,
//           record.iv,
//           keyBase64
//         );

//         if (cancelled) return;

//         const mimeType = record.mime_type || detectMimeType(record.filename);
//         const blob = new Blob([decrypted], { type: mimeType });
//         const url = URL.createObjectURL(blob);
//         blobUrlRef.current = url;

//         const expiresAt = new Date(record.expires_at).getTime();
//         const now = Date.now();
//         const initialRemaining = Math.max(0, Math.floor((expiresAt - now) / 1000));

//         if (initialRemaining <= 0) {
//           clearBlob();
//           setState('expired');
//           return;
//         }

//         setRemaining(initialRemaining);
//         setDocInfo({ filename: record.filename, mimeType });
//         setState('decrypted');
//       } catch (err) {
//         if (cancelled) return;
//         if (err instanceof AccessDeniedError) {
//           setState('expired');
//         } else {
//           setErrorMsg(
//             err instanceof Error ? err.message : 'Failed to load document'
//           );
//           setState('error');
//         }
//       }
//     };

//     load();

//     return () => {
//       cancelled = true;
//       clearBlob();
//     };
//   }, [token, keyBase64, clearBlob]);

//   // Countdown timer
//   useEffect(() => {
//     if (state !== 'decrypted') return;

//     const interval = setInterval(() => {
//       setRemaining((prev) => {
//         if (prev <= 1) {
//           clearBlob();
//           setState('expired');
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [state, clearBlob]);

//   // Clean up blob on unmount
//   useEffect(() => {
//     return () => clearBlob();
//   }, [clearBlob]);

//   const isImage = docInfo?.mimeType.startsWith('image/');
//   const isPdf = docInfo?.mimeType === 'application/pdf';

//   // ── Loading state ──────────────────────────────────────────────────────
//   if (state === 'loading') {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
//         <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mb-4" />
//         <h2 className="text-xl font-semibold text-slate-200">
//           Fetching encrypted record...
//         </h2>
//         <p className="text-sm text-slate-400 mt-2">
//           Retrieving ciphertext and IV from secure server
//         </p>
//       </div>
//     );
//   }

//   // ── Expired / revoked state ────────────────────────────────────────────
//   if (state === 'expired') {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
//         <div className="w-20 h-20 rounded-2xl bg-red-500/10 flex items-center justify-center border-2 border-red-500/30 mb-6">
//           <ShieldX className="w-10 h-10 text-red-400" />
//         </div>
//         <h2 className="text-2xl font-bold text-red-400 mb-2">
//           Access Revoked / Session Expired
//         </h2>
//         <p className="text-slate-400 max-w-md text-center">
//           This secure document link has expired. The time-limited access window
//           has closed and the decrypted content has been cleared from memory.
//         </p>
//         <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
//           <Lock className="w-3.5 h-3.5" />
//           <span>Decrypted data has been purged from browser memory</span>
//         </div>
//       </div>
//     );
//   }

//   // ── Error state ────────────────────────────────────────────────────────
//   if (state === 'error') {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
//         <div className="w-20 h-20 rounded-2xl bg-amber-500/10 flex items-center justify-center border-2 border-amber-500/30 mb-6">
//           <AlertTriangle className="w-10 h-10 text-amber-400" />
//         </div>
//         <h2 className="text-xl font-semibold text-amber-400 mb-2">
//           Unable to Load Document
//         </h2>
//         <p className="text-slate-400 max-w-md text-center text-sm">{errorMsg}</p>
//       </div>
//     );
//   }

//   // ── Decrypted document viewer ──────────────────────────────────────────
//   const timerColor =
//     remaining <= 10
//       ? 'text-red-400 border-red-500/30 bg-red-500/10'
//       : remaining <= 30
//         ? 'text-amber-400 border-amber-500/30 bg-amber-500/10'
//         : 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';

//   return (
//     <div className="space-y-4 animate-fade-in">
//       {/* Header bar with countdown */}
//       <div className="glass-card p-4 flex items-center justify-between flex-wrap gap-3">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
//             {isImage ? (
//               <ImageIcon className="w-5 h-5 text-emerald-400" />
//             ) : (
//               <FileText className="w-5 h-5 text-emerald-400" />
//             )}
//           </div>
//           <div>
//             <p className="text-sm font-medium text-slate-200">
//               {docInfo?.filename ?? 'Document'}
//             </p>
//             <p className="text-xs text-slate-500 flex items-center gap-1.5">
//               <Eye className="w-3 h-3" />
//               Decrypted locally in browser — key from URL fragment
//             </p>
//           </div>
//         </div>

//         <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${timerColor}`}>
//           <Timer className="w-4 h-4" />
//           <span className="font-mono font-semibold text-lg tabular-nums">
//             {formatTime(remaining)}
//           </span>
//           <span className="text-xs opacity-70">remaining</span>
//         </div>
//       </div>

//       {/* Document viewer */}
//       <div className="glass-card p-2 overflow-hidden">
//         {isImage && blobUrlRef.current ? (
//           <div className="flex items-center justify-center bg-slate-950/50 rounded-xl p-4 min-h-[400px]">
//             <img
//               src={blobUrlRef.current}
//               alt={docInfo?.filename ?? 'Medical image'}
//               className="max-w-full max-h-[70vh] rounded-lg object-contain"
//             />
//           </div>
//         ) : isPdf && blobUrlRef.current ? (
//           <iframe
//             src={blobUrlRef.current}
//             title="Medical Document"
//             className="w-full h-[70vh] rounded-xl border-0 bg-slate-950"
//           />
//         ) : blobUrlRef.current ? (
//           <div className="flex flex-col items-center justify-center py-16">
//             <FileText className="w-12 h-12 text-slate-500 mb-4" />
//             <p className="text-slate-300 mb-1">{docInfo?.filename}</p>
//             <p className="text-xs text-slate-500 mb-4">
//               This file type cannot be previewed inline
//             </p>
//             <a
//               href={blobUrlRef.current}
//               download={docInfo?.filename ?? 'document'}
//               className="btn-secondary flex items-center gap-2"
//             >
//               <Download className="w-4 h-4" />
//               Download File
//             </a>
//           </div>
//         ) : null}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { Unlock, Clock, AlertOctagon, Loader2 } from "lucide-react";
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200">
        <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mb-3" />
        <p className="text-sm font-medium">
          Validating token & decrypting record in memory...
        </p>
      </div>
    );
  }

  if (error || !blobUrl) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-red-500/30 rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-14 h-14 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto text-red-400 mb-4">
            <AlertOctagon className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-100 mb-2">
            Access Terminated
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed mb-6">{error}</p>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 font-mono">
            Zero-knowledge session wiped from browser RAM.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="bg-slate-900/90 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <Unlock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              {docData?.filename}
            </h2>
            <p className="text-xs text-slate-400">
              Consultation Session: {docData?.doctor_alias || "Doctor"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 font-mono text-xs">
            <Clock className="w-4 h-4 animate-pulse" />
            <span>
              Time Left: {Math.floor(secondsRemaining / 60)}:
              {String(secondsRemaining % 60).padStart(2, "0")}
            </span>
          </div>
          <span className="hidden sm:inline-flex text-xs font-mono text-emerald-400 px-3 py-1 bg-emerald-950/60 border border-emerald-500/30 rounded-full">
            In-Memory Decrypted
          </span>
        </div>
      </header>

      <main className="flex-1 p-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl h-[75vh] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
          {docData?.file_type?.includes("image") ? (
            <img
              src={blobUrl}
              alt="Medical Document"
              className="w-full h-full object-contain p-4"
            />
          ) : (
            <iframe
              src={blobUrl}
              className="w-full h-full border-0"
              title="Medical Report"
            />
          )}
        </div>
      </main>
    </div>
  );
};