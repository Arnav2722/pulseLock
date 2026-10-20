// import React, { useState } from "react";
// import { X, Share2, Copy, Check, ShieldAlert } from "lucide-react";
// import { MedicalDocument } from "../types";

// interface ShareModalProps {
//   document: MedicalDocument;
//   encryptionKey: string;
//   onClose: () => void;
// }

// interface ShareResponse {
//   status: string;
//   token: string;
//   valid_until: number;
// }

// export const ShareModal: React.FC<ShareModalProps> = ({
//   document,
//   encryptionKey,
//   onClose,
// }) => {
//   const [doctorAlias, setDoctorAlias] = useState("Dr. Sharma");
//   const [duration, setDuration] = useState("60");
//   const [loading, setLoading] = useState(false);
//   const [generatedLink, setGeneratedLink] = useState("");
//   const [copied, setCopied] = useState(false);

//   const handleGenerate = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("http://localhost:8000/api/share", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           doc_id: document.id,
//           duration_seconds: parseInt(duration, 10),
//           doctor_alias: doctorAlias,
//         }),
//       });

//       if (!res.ok) throw new Error("Could not create share session");
//       const data: ShareResponse = await res.json();

//       const origin = window.location.origin;
//       const shareUrl = `${origin}/#token=${data.token}&key=${encodeURIComponent(encryptionKey)}`;
//       setGeneratedLink(shareUrl);
//     } catch (err: unknown) {
//       const message =
//         err instanceof Error ? err.message : "Failed to create share link";
//       alert(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(generatedLink);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2500);
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
//       <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
//         <button
//           onClick={onClose}
//           className="absolute top-5 right-5 text-slate-400 hover:text-slate-200 transition-colors"
//         >
//           <X className="w-5 h-5" />
//         </button>

//         <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
//           <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
//             <Share2 className="w-5 h-5" />
//           </div>
//           <div>
//             <h3 className="text-lg font-semibold text-slate-100">
//               Create Ephemeral Access Pass
//             </h3>
//             <p className="text-xs text-slate-400 font-mono">
//               {document.filename}
//             </p>
//           </div>
//         </div>

//         {!generatedLink ? (
//           <div className="mt-5 space-y-4">
//             <div>
//               <label className="text-xs text-slate-400 font-medium block mb-1.5">
//                 Consulting Doctor / Specialist
//               </label>
//               <input
//                 type="text"
//                 value={doctorAlias}
//                 onChange={(e) => setDoctorAlias(e.target.value)}
//                 placeholder="e.g. Dr. Verma (Cardiologist)"
//                 className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-cyan-500"
//               />
//             </div>

//             <div>
//               <label className="text-xs text-slate-400 font-medium block mb-1.5">
//                 Access Duration (Auto-Revokes)
//               </label>
//               <div className="grid grid-cols-3 gap-2.5">
//                 {[
//                   { label: "60 Seconds (Live Demo)", val: "60" },
//                   { label: "15 Minutes", val: "900" },
//                   { label: "1 Hour", val: "3600" },
//                 ].map((item) => (
//                   <button
//                     key={item.val}
//                     type="button"
//                     onClick={() => setDuration(item.val)}
//                     className={`text-xs py-2.5 px-2 rounded-xl border text-center transition-all ${
//                       duration === item.val
//                         ? "bg-cyan-500/15 border-cyan-500/50 text-cyan-300 font-semibold shadow-sm"
//                         : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
//                     }`}
//                   >
//                     {item.label}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-start gap-2.5">
//               <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
//               <p className="text-xs text-slate-400 leading-relaxed">
//                 The private key stays strictly inside the hash fragment. When
//                 the timer expires, the backend cuts the token and memory is
//                 flushed.
//               </p>
//             </div>

//             <button
//               onClick={handleGenerate}
//               disabled={loading}
//               className="w-full mt-2 py-3 bg-linear-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-semibold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2"
//             >
//               {loading ? "Generating Secure Pass..." : "Generate One-Time Pass"}
//             </button>
//           </div>
//         ) : (
//           <div className="mt-5 space-y-4">
//             <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-xl">
//               <p className="text-xs text-emerald-400 font-medium mb-1">
//                 Pass Created Successfully
//               </p>
//               <p className="text-xs text-slate-300">
//                 Valid for {duration} seconds. Share this link directly with{" "}
//                 {doctorAlias}:
//               </p>
//             </div>

//             <div className="flex items-center gap-2">
//               <input
//                 type="text"
//                 readOnly
//                 value={generatedLink}
//                 className="w-full bg-slate-950 border border-slate-800 text-slate-300 text-xs font-mono rounded-xl px-3.5 py-3 select-all focus:outline-none"
//               />
//               <button
//                 onClick={copyToClipboard}
//                 className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors shrink-0"
//               >
//                 {copied ? (
//                   <Check className="w-4 h-4 text-emerald-400" />
//                 ) : (
//                   <Copy className="w-4 h-4" />
//                 )}
//               </button>
//             </div>

//             <div className="pt-2 flex justify-end">
//               <button
//                 onClick={onClose}
//                 className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-colors"
//               >
//                 Done
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

import React, { useState } from "react";
import { X, Check, Copy } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-xs">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
          <div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
              Authorization
            </span>
            <h3 className="font-mono text-xs uppercase tracking-wider text-zinc-200">
              Ephemeral Pass Setup
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!generatedLink ? (
          <div className="space-y-4 font-mono text-xs">
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 uppercase">
                Consulting Clinician
              </label>
              <input
                type="text"
                value={doctorAlias}
                onChange={(e) => setDoctorAlias(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-200 focus:outline-none focus:border-zinc-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 uppercase">
                Window Duration
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "60 SEC", val: "60" },
                  { label: "15 MIN", val: "900" },
                  { label: "1 HOUR", val: "3600" },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setDuration(item.val)}
                    className={`py-2 text-[10px] border transition-colors cursor-pointer ${
                      duration === item.val
                        ? "border-zinc-400 bg-zinc-900 text-zinc-100 font-semibold"
                        : "border-zinc-800 text-zinc-500 hover:border-zinc-700"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold uppercase tracking-wider text-xs transition-colors cursor-pointer mt-2"
            >
              {loading ? "Signing..." : "Issue Pass"}
            </button>
          </div>
        ) : (
          <div className="space-y-4 font-mono text-xs">
            <div className="p-3 bg-zinc-900 border border-zinc-800 text-zinc-400 text-[11px]">
              Access token sealed with URI key fragment. Valid for {duration}{" "}
              seconds.
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={generatedLink}
                className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-300 text-[11px] select-all focus:outline-none"
              />
              <button
                onClick={copyToClipboard}
                className="p-2 border border-zinc-800 hover:border-zinc-700 text-zinc-300 cursor-pointer"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2 border border-zinc-800 hover:border-zinc-700 text-zinc-400 text-xs uppercase cursor-pointer"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};