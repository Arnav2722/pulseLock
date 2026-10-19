// import { useState, useEffect } from 'react';
// import {
//   X,
//   Clock,
//   Link2,
//   Copy,
//   Check,
//   Loader2,
//   AlertCircle,
//   ShieldCheck,
//   KeyRound,
// } from 'lucide-react';
// import type { StoredDocument } from '@/lib/api';
// import { createShareLink, ApiError } from '@/lib/api';

// interface ShareModalProps {
//   document: StoredDocument | null;
//   onClose: () => void;
// }

// const DURATION_OPTIONS = [
//   { label: '60 seconds', value: 60, description: 'Demo — quick view' },
//   { label: '15 minutes', value: 900, description: 'Short consultation' },
//   { label: '1 hour', value: 3600, description: 'Extended review' },
// ];

// export default function ShareModal({ document: doc, onClose }: ShareModalProps) {
//   const [selectedDuration, setSelectedDuration] = useState(60);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [shareLink, setShareLink] = useState('');
//   const [error, setError] = useState('');
//   const [copied, setCopied] = useState(false);

//   useEffect(() => {
//     if (doc) {
//       setSelectedDuration(60);
//       setShareLink('');
//       setError('');
//       setCopied(false);
//     }
//   }, [doc]);

//   if (!doc) return null;

//   const handleGenerate = async () => {
//     if (!doc) return;
//     setIsGenerating(true);
//     setError('');

//     try {
//       const result = await createShareLink({
//         doc_id: doc.doc_id,
//         duration_seconds: selectedDuration,
//       });

//       const link = `http://localhost:5173/view/${result.token}#${doc.exportedKeyBase64}`;
//       setShareLink(link);
//     } catch (err) {
//       const msg =
//         err instanceof ApiError
//           ? err.message
//           : err instanceof Error
//             ? err.message
//             : 'Failed to generate share link';
//       setError(msg);
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const handleCopy = async () => {
//     try {
//       await navigator.clipboard.writeText(shareLink);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     } catch {
//       // clipboard may be blocked — select text as fallback
//     }
//   };

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
//       onClick={onClose}
//     >
//       <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" />

//       <div
//         className="relative glass-card w-full max-w-lg p-6 animate-slide-up max-h-[90vh] overflow-y-auto"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors"
//         >
//           <X className="w-5 h-5" />
//         </button>

//         <div className="flex items-center gap-3 mb-6">
//           <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
//             <Link2 className="w-5 h-5 text-emerald-400" />
//           </div>
//           <div>
//             <h2 className="text-lg font-semibold text-slate-100">
//               Generate Secure Share Link
//             </h2>
//             <p className="text-xs text-slate-400 truncate max-w-[300px]">
//               {doc.filename}
//             </p>
//           </div>
//         </div>

//         {!shareLink ? (
//           <>
//             <label className="block text-sm font-medium text-slate-300 mb-3">
//               <Clock className="w-4 h-4 inline mr-1.5 -mt-0.5" />
//               Validity Duration
//             </label>
//             <div className="space-y-2 mb-6">
//               {DURATION_OPTIONS.map((opt) => (
//                 <button
//                   key={opt.value}
//                   onClick={() => setSelectedDuration(opt.value)}
//                   className={`
//                     w-full flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200
//                     ${
//                       selectedDuration === opt.value
//                         ? 'border-emerald-500/50 bg-emerald-500/10'
//                         : 'border-slate-700 bg-slate-800/40 hover:border-slate-600'
//                     }
//                   `}
//                 >
//                   <div className="flex items-center gap-3">
//                     <Clock
//                       className={`w-4 h-4 ${
//                         selectedDuration === opt.value
//                           ? 'text-emerald-400'
//                           : 'text-slate-500'
//                       }`}
//                     />
//                     <div className="text-left">
//                       <p
//                         className={`text-sm font-medium ${
//                           selectedDuration === opt.value
//                             ? 'text-emerald-300'
//                             : 'text-slate-300'
//                         }`}
//                       >
//                         {opt.label}
//                       </p>
//                       <p className="text-xs text-slate-500">
//                         {opt.description}
//                       </p>
//                     </div>
//                   </div>
//                   <div
//                     className={`w-4 h-4 rounded-full border-2 transition-all ${
//                       selectedDuration === opt.value
//                         ? 'border-emerald-500 bg-emerald-500'
//                         : 'border-slate-600'
//                     }`}
//                   />
//                 </button>
//               ))}
//             </div>

//             {error && (
//               <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
//                 <AlertCircle className="w-4 h-4 flex-shrink-0" />
//                 {error}
//               </div>
//             )}

//             <button
//               onClick={handleGenerate}
//               disabled={isGenerating}
//               className="btn-primary w-full flex items-center justify-center gap-2"
//             >
//               {isGenerating ? (
//                 <>
//                   <Loader2 className="w-4 h-4 animate-spin" />
//                   Generating secure link...
//                 </>
//               ) : (
//                 <>
//                   <Link2 className="w-4 h-4" />
//                   Generate Link
//                 </>
//               )}
//             </button>
//           </>
//         ) : (
//           <div className="space-y-4">
//             <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
//               <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
//               <p className="text-xs text-emerald-300">
//                 Link generated successfully. The encryption key is embedded in
//                 the URL hash fragment (<code className="font-mono">#</code>) so
//                 it never reaches the server.
//               </p>
//             </div>

//             <div>
//               <label className="text-xs font-medium text-slate-400 mb-2 flex items-center gap-1.5">
//                 <KeyRound className="w-3.5 h-3.5" />
//                 Doctor Access Link
//               </label>
//               <div className="flex gap-2">
//                 <input
//                   type="text"
//                   readOnly
//                   value={shareLink}
//                   className="input-field flex-1 text-xs font-mono truncate"
//                   onFocus={(e) => e.currentTarget.select()}
//                 />
//                 <button
//                   onClick={handleCopy}
//                   className={`btn-secondary !px-3 flex items-center gap-1.5 flex-shrink-0 ${
//                     copied ? '!border-emerald-500/40' : ''
//                   }`}
//                 >
//                   {copied ? (
//                     <>
//                       <Check className="w-4 h-4 text-emerald-400" />
//                       <span className="text-emerald-400">Copied</span>
//                     </>
//                   ) : (
//                     <>
//                       <Copy className="w-4 h-4" />
//                       Copy
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>

//             <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40">
//               <div className="flex items-start gap-2.5">
//                 <KeyRound className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
//                 <div className="text-xs text-slate-400 space-y-1.5">
//                   <p className="font-medium text-slate-300">
//                     How the key stays safe:
//                   </p>
//                   <ul className="space-y-1 ml-1">
//                     <li>
//                       • The <code className="font-mono text-amber-400">#</code>{' '}
//                       fragment is never sent to the server — browsers exclude it
//                       from HTTP requests
//                     </li>
//                     <li>
//                       • Only someone with the full link can decrypt the document
//                     </li>
//                     <li>
//                       • The link expires after {selectedDuration} seconds — the
//                       server revokes access automatically
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//             </div>

//             <button
//               onClick={onClose}
//               className="btn-secondary w-full flex items-center justify-center gap-2"
//             >
//               Done
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { X, Share2, Copy, Check, ShieldAlert } from "lucide-react";
import { MedicalDocument } from "../types";

interface ShareModalProps {
  document: MedicalDocument;
  encryptionKey: string;
  onClose: () => void;
}

interface ShareResponse {
  status: string;
  token: string;
  valid_until: number;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  document,
  encryptionKey,
  onClose,
}) => {
  const [doctorAlias, setDoctorAlias] = useState("Dr. Sharma");
  const [duration, setDuration] = useState("60");
  const [loading, setLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doc_id: document.id,
          duration_seconds: parseInt(duration, 10),
          doctor_alias: doctorAlias,
        }),
      });

      if (!res.ok) throw new Error("Could not create share session");
      const data: ShareResponse = await res.json();

      const origin = window.location.origin;
      const shareUrl = `${origin}/#token=${data.token}&key=${encodeURIComponent(encryptionKey)}`;
      setGeneratedLink(shareUrl);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create share link";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-100">
              Create Ephemeral Access Pass
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              {document.filename}
            </p>
          </div>
        </div>

        {!generatedLink ? (
          <div className="mt-5 space-y-4">
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1.5">
                Consulting Doctor / Specialist
              </label>
              <input
                type="text"
                value={doctorAlias}
                onChange={(e) => setDoctorAlias(e.target.value)}
                placeholder="e.g. Dr. Verma (Cardiologist)"
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1.5">
                Access Duration (Auto-Revokes)
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { label: "60 Seconds (Live Demo)", val: "60" },
                  { label: "15 Minutes", val: "900" },
                  { label: "1 Hour", val: "3600" },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setDuration(item.val)}
                    className={`text-xs py-2.5 px-2 rounded-xl border text-center transition-all ${
                      duration === item.val
                        ? "bg-cyan-500/15 border-cyan-500/50 text-cyan-300 font-semibold shadow-sm"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-400 leading-relaxed">
                The private key stays strictly inside the hash fragment. When
                the timer expires, the backend cuts the token and memory is
                flushed.
              </p>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full mt-2 py-3 bg-linear-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-semibold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2"
            >
              {loading ? "Generating Secure Pass..." : "Generate One-Time Pass"}
            </button>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-xl">
              <p className="text-xs text-emerald-400 font-medium mb-1">
                Pass Created Successfully
              </p>
              <p className="text-xs text-slate-300">
                Valid for {duration} seconds. Share this link directly with{" "}
                {doctorAlias}:
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={generatedLink}
                className="w-full bg-slate-950 border border-slate-800 text-slate-300 text-xs font-mono rounded-xl px-3.5 py-3 select-all focus:outline-none"
              />
              <button
                onClick={copyToClipboard}
                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors shrink-0"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};