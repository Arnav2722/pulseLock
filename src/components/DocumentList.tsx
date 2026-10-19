// import { FileText, ImageIcon, Share2, Clock } from 'lucide-react';
// import type { StoredDocument } from '@/lib/api';

// interface DocumentListProps {
//   documents: StoredDocument[];
//   onShare: (doc: StoredDocument) => void;
// }

// function formatDate(iso: string): string {
//   const d = new Date(iso);
//   return d.toLocaleString('en-US', {
//     month: 'short',
//     day: 'numeric',
//     year: 'numeric',
//     hour: 'numeric',
//     minute: '2-digit',
//   });
// }

// const isImage = (name: string) =>
//   /\.(png|jpe?g|gif|webp|bmp|tiff?)$/i.test(name);

// export default function DocumentList({ documents, onShare }: DocumentListProps) {
//   return (
//     <div className="glass-card glass-card-hover p-6 animate-slide-up">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-lg font-semibold text-slate-100">
//           Uploaded Documents
//         </h2>
//         <span className="badge-neutral">
//           <FileText className="w-3 h-3" />
//           {documents.length} {documents.length === 1 ? 'file' : 'files'}
//         </span>
//       </div>

//       {documents.length === 0 ? (
//         <div className="text-center py-12 text-slate-500">
//           <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
//           <p className="text-sm">No documents uploaded yet</p>
//           <p className="text-xs mt-1">
//             Encrypted files will appear here after upload
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-2">
//           {documents.map((doc) => (
//             <div
//               key={doc.doc_id}
//               className="group flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 hover:border-emerald-500/20 hover:bg-slate-800/60 transition-all duration-200"
//             >
//               <div className="w-10 h-10 rounded-lg bg-slate-700/40 flex items-center justify-center flex-shrink-0">
//                 {isImage(doc.filename) ? (
//                   <ImageIcon className="w-5 h-5 text-slate-400" />
//                 ) : (
//                   <FileText className="w-5 h-5 text-slate-400" />
//                 )}
//               </div>

//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-medium text-slate-200 truncate">
//                   {doc.filename}
//                 </p>
//                 <div className="flex items-center gap-2 mt-0.5">
//                   <Clock className="w-3 h-3 text-slate-500" />
//                   <span className="text-xs text-slate-500">
//                     {formatDate(doc.uploaded_at)}
//                   </span>
//                 </div>
//               </div>

//               <button
//                 onClick={() => onShare(doc)}
//                 className="btn-primary !py-2 !px-4 !text-sm flex items-center gap-2 flex-shrink-0"
//               >
//                 <Share2 className="w-4 h-4" />
//                 Share
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

import React from "react";
import { FileText, Share2, Shield } from "lucide-react";
import { MedicalDocument } from "../types";

interface DocumentListProps {
  documents: MedicalDocument[];
  keysMap: Record<string, string>;
  onShare: (doc: MedicalDocument, key: string) => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  keysMap,
  onShare,
}) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h3 className="font-semibold text-slate-100 text-lg">
            Protected Medical Vault
          </h3>
          <p className="text-xs text-slate-400">
            All records encrypted with unique zero-knowledge master keys
          </p>
        </div>
        <span className="text-xs font-mono px-3 py-1 bg-slate-800 text-slate-300 rounded-full border border-slate-700">
          {documents.length} Records Locked
        </span>
      </div>

      {documents.length === 0 ? (
        <div className="py-12 text-center text-slate-400">
          <FileText className="w-12 h-12 mx-auto text-slate-700 mb-2" />
          <p className="text-sm">No health documents in vault yet.</p>
          <p className="text-xs text-slate-400">
            Upload a report above to initialize zero-trust storage.
          </p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="p-4 bg-slate-950/70 border border-slate-800/90 rounded-xl hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-200 line-clamp-1">
                      {doc.filename}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {doc.file_category || "Medical Record"}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                  ID: {doc.id.slice(0, 6)}...
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                <div className="flex items-center text-[11px] text-slate-400 gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>AES-256 GCM</span>
                </div>

                <button
                  onClick={() => onShare(doc, keysMap[doc.id] || "")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Share Pass
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};