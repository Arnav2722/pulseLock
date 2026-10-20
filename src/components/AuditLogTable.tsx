// import React, { useState } from "react";
// import { Activity, ShieldCheck, RefreshCw, CheckCircle2 } from "lucide-react";
// import { AuditLogEntry } from "../types";

// interface AuditLogTableProps {
//   logs: AuditLogEntry[];
//   onRefresh: () => void;
// }

// interface IntegrityResponse {
//   is_valid: boolean;
//   total_logs_checked: number;
//   message: string;
// }

// export const AuditLogTable: React.FC<AuditLogTableProps> = ({
//   logs,
//   onRefresh,
// }) => {
//   const [verifying, setVerifying] = useState(false);
//   const [verificationResult, setVerificationResult] = useState<string | null>(
//     null,
//   );

//   const handleVerifyIntegrity = async () => {
//     setVerifying(true);
//     setVerificationResult(null);
//     try {
//       const res = await fetch(
//         "http://localhost:8000/api/audit/verify-integrity",
//       );
//       const data: IntegrityResponse = await res.json();
//       if (data.is_valid) {
//         setVerificationResult(
//           `Verified: All ${data.total_logs_checked} records matched cryptographic HMAC signatures.`,
//         );
//       } else {
//         setVerificationResult(`Tampering Detected: ${data.message}`);
//       }
//     } catch {
//       setVerificationResult("Verification failed: Backend offline");
//     } finally {
//       setVerifying(false);
//     }
//   };

//   return (
//     <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
//         <div className="flex items-center space-x-3">
//           <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl">
//             <Activity className="w-5 h-5" />
//           </div>
//           <div>
//             <h3 className="font-semibold text-slate-100 text-lg">
//               Tamper-Proof Audit Chain
//             </h3>
//             <p className="text-xs text-slate-400">
//               Immutable HMAC-SHA256 chained access logs
//             </p>
//           </div>
//         </div>

//         <div className="flex items-center space-x-2">
//           <button
//             onClick={handleVerifyIntegrity}
//             disabled={verifying}
//             className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
//           >
//             <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
//             {verifying ? "Checking Chain..." : "Verify Merkle Chain"}
//           </button>
//           <button
//             onClick={onRefresh}
//             className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
//           >
//             <RefreshCw className="w-4 h-4" />
//           </button>
//         </div>
//       </div>

//       {verificationResult && (
//         <div className="mt-4 p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
//           <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
//           <span>{verificationResult}</span>
//         </div>
//       )}

//       <div className="mt-4 overflow-x-auto">
//         <table className="w-full text-left text-xs">
//           <thead>
//             <tr className="border-b border-slate-800 text-slate-400">
//               <th className="pb-3 font-medium">Timestamp</th>
//               <th className="pb-3 font-medium">Client IP</th>
//               <th className="pb-3 font-medium">Event Status</th>
//               <th className="pb-3 font-medium">Micro-Chain Hash</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
//             {logs.length === 0 ? (
//               <tr>
//                 <td
//                   colSpan={4}
//                   className="py-6 text-center text-slate-400 font-sans"
//                 >
//                   No access events registered yet.
//                 </td>
//               </tr>
//             ) : (
//               logs.map((log, idx) => (
//                 <tr
//                   key={idx}
//                   className="hover:bg-slate-800/30 transition-colors"
//                 >
//                   <td className="py-2.5 text-slate-300">
//                     {new Date(
//                       (log.timestamp || Date.now() / 1000) * 1000,
//                     ).toLocaleTimeString()}
//                   </td>
//                   <td className="py-2.5 text-slate-400">
//                     {log.ip_address || "127.0.0.1"}
//                   </td>
//                   <td className="py-2.5">
//                     <span
//                       className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
//                         log.status === "SUCCESS" ||
//                         log.status === "SUCCESS_ACCESS"
//                           ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
//                           : "bg-red-950 text-red-400 border border-red-500/30"
//                       }`}
//                     >
//                       {log.status}
//                     </span>
//                   </td>
//                   <td className="py-2.5 text-slate-400 truncate max-w-30">
//                     {log.current_hash
//                       ? `${log.current_hash.slice(0, 16)}...`
//                       : "hmac-genesis"}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

import React, { useState } from "react";
import { AuditLogEntry } from "../types";

interface AuditLogTableProps {
  logs: AuditLogEntry[];
  onRefresh: () => void;
}

interface IntegrityResponse {
  is_valid: boolean;
  total_logs_checked: number;
  message: string;
}

export const AuditLogTable: React.FC<AuditLogTableProps> = ({
  logs,
  onRefresh,
}) => {
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<string | null>(
    null,
  );

  const handleVerifyIntegrity = async () => {
    setVerifying(true);
    setVerificationResult(null);
    try {
      const res = await fetch(
        "http://localhost:8000/api/audit/verify-integrity",
      );
      const data: IntegrityResponse = await res.json();
      if (data.is_valid) {
        setVerificationResult(
          `Verified: ${data.total_logs_checked} records matched HMAC signatures.`,
        );
      } else {
        setVerificationResult(`Tampering Detected: ${data.message}`);
      }
    } catch {
      setVerificationResult("Verification failed: Backend offline");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="border border-zinc-900 bg-zinc-950 p-6 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-zinc-900 gap-3">
        <div>
          <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest block">
            Integrity Layer
          </span>
          <h3 className="font-mono text-xs uppercase tracking-wider text-zinc-200">
            HMAC Micro-Chained Telemetry
          </h3>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleVerifyIntegrity}
            disabled={verifying}
            className="px-3 py-1.5 text-xs font-mono uppercase bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700 transition-colors cursor-pointer"
          >
            {verifying ? "Checking..." : "Verify Hash Chain"}
          </button>
          <button
            onClick={onRefresh}
            className="px-3 py-1.5 text-xs font-mono uppercase border border-zinc-900 text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer"
          >
            Poll
          </button>
        </div>
      </div>

      {verificationResult && (
        <div className="p-3 bg-zinc-900 border border-zinc-800 text-xs font-mono text-emerald-400">
          {verificationResult}
        </div>
      )}

      <div className="overflow-x-auto border border-zinc-900">
        <table className="w-full text-left font-mono text-[11px]">
          <thead>
            <tr className="border-b border-zinc-900 bg-zinc-950 text-zinc-600 text-[10px] uppercase">
              <th className="p-3 font-normal">Timestamp</th>
              <th className="p-3 font-normal">Client IP</th>
              <th className="p-3 font-normal">Status</th>
              <th className="p-3 font-normal">Merkle Signature</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {logs.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-4 text-center text-zinc-600 uppercase"
                >
                  No telemetry logged.
                </td>
              </tr>
            ) : (
              logs.map((log, idx) => (
                <tr key={idx} className="hover:bg-zinc-900/20">
                  <td className="p-3 text-zinc-400">
                    {new Date(
                      (log.timestamp || Date.now() / 1000) * 1000,
                    ).toLocaleTimeString()}
                  </td>
                  <td className="p-3 text-zinc-400">
                    {log.ip_address || "127.0.0.1"}
                  </td>
                  <td className="p-3">
                    <span
                      className={`text-[10px] uppercase ${
                        log.status === "SUCCESS" ||
                        log.status === "SUCCESS_ACCESS"
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      [{log.status}]
                    </span>
                  </td>
                  <td className="p-3 text-zinc-600 truncate max-w-xs">
                    {log.current_hash ? log.current_hash : "hmac-genesis"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};