// import { useEffect, useState } from 'react';
// import {
//   ScrollText,
//   CheckCircle2,
//   XCircle,
//   RefreshCw,
//   Globe,
//   Clock,
// } from 'lucide-react';
// import { fetchLogs, type AccessLog } from '@/lib/api';

// function formatTimestamp(iso: string): string {
//   const d = new Date(iso);
//   return d.toLocaleString('en-US', {
//     month: 'short',
//     day: 'numeric',
//     hour: 'numeric',
//     minute: '2-digit',
//     second: '2-digit',
//   });
// }

// export default function AuditLogTable() {
//   const [logs, setLogs] = useState<AccessLog[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const loadLogs = async () => {
//     try {
//       const data = await fetchLogs();
//       setLogs(data);
//       setError('');
//     } catch (err) {
//       setError(
//         err instanceof Error ? err.message : 'Failed to fetch audit logs'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadLogs();
//     const interval = setInterval(loadLogs, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="glass-card glass-card-hover p-6 animate-slide-up">
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-xl bg-slate-700/40 flex items-center justify-center border border-slate-600/40">
//             <ScrollText className="w-5 h-5 text-slate-300" />
//           </div>
//           <div>
//             <h2 className="text-lg font-semibold text-slate-100">
//               Access Audit Log
//             </h2>
//             <p className="text-xs text-slate-400">
//               Real-time document access monitoring
//             </p>
//           </div>
//         </div>
//         <button
//           onClick={loadLogs}
//           className="btn-secondary !px-3 !py-2 flex items-center gap-1.5"
//           title="Refresh"
//         >
//           <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
//           Refresh
//         </button>
//       </div>

//       {error && (
//         <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
//           {error}
//         </div>
//       )}

//       {loading && logs.length === 0 ? (
//         <div className="text-center py-12 text-slate-500">
//           <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin opacity-40" />
//           <p className="text-sm">Loading audit logs...</p>
//         </div>
//       ) : logs.length === 0 ? (
//         <div className="text-center py-12 text-slate-500">
//           <ScrollText className="w-10 h-10 mx-auto mb-3 opacity-40" />
//           <p className="text-sm">No access events recorded yet</p>
//           <p className="text-xs mt-1">
//             Log entries appear when a doctor opens a shared document
//           </p>
//         </div>
//       ) : (
//         <div className="overflow-x-auto -mx-2">
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="text-left text-xs text-slate-500 uppercase tracking-wider">
//                 <th className="font-medium px-3 py-2.5">
//                   <Clock className="w-3 h-3 inline mr-1 -mt-0.5" />
//                   Timestamp
//                 </th>
//                 <th className="font-medium px-3 py-2.5">
//                   <Globe className="w-3 h-3 inline mr-1 -mt-0.5" />
//                   IP Address
//                 </th>
//                 <th className="font-medium px-3 py-2.5">Status</th>
//                 <th className="font-medium px-3 py-2.5">Document</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-800">
//               {logs.map((log) => (
//                 <tr
//                   key={log.id}
//                   className="hover:bg-slate-800/30 transition-colors"
//                 >
//                   <td className="px-3 py-3 text-slate-400 font-mono text-xs">
//                     {formatTimestamp(log.timestamp)}
//                   </td>
//                   <td className="px-3 py-3 text-slate-300 font-mono text-xs">
//                     {log.ip_address}
//                   </td>
//                   <td className="px-3 py-3">
//                     {log.access_status === 'SUCCESS' ? (
//                       <span className="badge-success">
//                         <CheckCircle2 className="w-3 h-3" />
//                         SUCCESS
//                       </span>
//                     ) : (
//                       <span className="badge-error">
//                         <XCircle className="w-3 h-3" />
//                         EXPIRED
//                       </span>
//                     )}
//                   </td>
//                   <td className="px-3 py-3 text-slate-300 truncate max-w-[200px]">
//                     {log.document_name}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState } from "react";
import { Activity, ShieldCheck, RefreshCw, CheckCircle2 } from "lucide-react";
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
          `Verified: All ${data.total_logs_checked} records matched cryptographic HMAC signatures.`,
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
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 text-lg">
              Tamper-Proof Audit Chain
            </h3>
            <p className="text-xs text-slate-400">
              Immutable HMAC-SHA256 chained access logs
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleVerifyIntegrity}
            disabled={verifying}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            {verifying ? "Checking Chain..." : "Verify Merkle Chain"}
          </button>
          <button
            onClick={onRefresh}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {verificationResult && (
        <div className="mt-4 p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{verificationResult}</span>
        </div>
      )}

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="pb-3 font-medium">Timestamp</th>
              <th className="pb-3 font-medium">Client IP</th>
              <th className="pb-3 font-medium">Event Status</th>
              <th className="pb-3 font-medium">Micro-Chain Hash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
            {logs.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-6 text-center text-slate-400 font-sans"
                >
                  No access events registered yet.
                </td>
              </tr>
            ) : (
              logs.map((log, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-2.5 text-slate-300">
                    {new Date(
                      (log.timestamp || Date.now() / 1000) * 1000,
                    ).toLocaleTimeString()}
                  </td>
                  <td className="py-2.5 text-slate-400">
                    {log.ip_address || "127.0.0.1"}
                  </td>
                  <td className="py-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        log.status === "SUCCESS" ||
                        log.status === "SUCCESS_ACCESS"
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                          : "bg-red-950 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-400 truncate max-w-30">
                    {log.current_hash
                      ? `${log.current_hash.slice(0, 16)}...`
                      : "hmac-genesis"}
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