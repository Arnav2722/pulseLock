// import React, { useState, useRef } from "react";
// import { UploadCloud, ShieldCheck, Lock, Loader2 } from "lucide-react";
// import { generateAESKey, exportKeyToBase64, encryptFile } from "../lib/crypto";
// import { MedicalDocument } from "../types";

// interface FileUploadCardProps {
//   onUploadSuccess: (doc: MedicalDocument, rawKey: string) => void;
// }

// interface ServerUploadResponse {
//   status: string;
//   doc_id?: string;
//   id?: string;
// }

// export const FileUploadCard: React.FC<FileUploadCardProps> = ({
//   onUploadSuccess,
// }) => {
//   const [dragActive, setDragActive] = useState(false);
//   const [encrypting, setEncrypting] = useState(false);
//   const [category, setCategory] = useState("Blood Report");
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleFile = async (file: File) => {
//     setEncrypting(true);

//     try {
//       const key = await generateAESKey();
//       const base64Key = await exportKeyToBase64(key);
//       const { ciphertextBase64, ivBase64 } = await encryptFile(file, key);

//       const res = await fetch("http://localhost:8000/api/upload", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           filename: file.name,
//           file_type: file.type || "application/pdf",
//           file_category: category,
//           ciphertext: ciphertextBase64,
//           iv: ivBase64,
//         }),
//       });

//       if (!res.ok) throw new Error("Upload failed on server");
//       const data: ServerUploadResponse = await res.json();

//       onUploadSuccess(
//         {
//           id: data.doc_id || data.id || String(Date.now()),
//           filename: file.name,
//           file_type: file.type,
//           file_category: category,
//           created_at: Date.now() / 1000,
//         },
//         base64Key,
//       );
//     } catch (err: unknown) {
//       const errorMessage =
//         err instanceof Error ? err.message : "Encryption or upload error";
//       alert(errorMessage);
//     } finally {
//       setEncrypting(false);
//     }
//   };

//   return (
//     <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
//       <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
//         <div className="flex items-center space-x-3">
//           <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
//             <ShieldCheck className="w-6 h-6" />
//           </div>
//           <div>
//             <h3 className="font-semibold text-slate-100 text-lg">
//               Secure Document Ingestion
//             </h3>
//             <p className="text-xs text-slate-400">
//               Local AES-256-GCM zero-trust client encryption
//             </p>
//           </div>
//         </div>
//         <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
//           <Lock className="w-3.5 h-3.5" /> Client Encrypted
//         </span>
//       </div>

//       <div className="mt-5 grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
//         <label className="text-xs text-slate-400 block md:col-span-1 self-center">
//           Record Category:
//         </label>
//         <select
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//           className="md:col-span-3 bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 transition-colors"
//         >
//           <option value="Blood Report">Blood Report (CBC, Lipid, Sugar)</option>
//           <option value="Diagnostic Scan">
//             Scan / Imaging (MRI, CT, X-Ray)
//           </option>
//           <option value="Prescription">Doctor Prescription</option>
//           <option value="Discharge Summary">Discharge Summary / EHR</option>
//         </select>
//       </div>

//       <div
//         onDragOver={(e) => {
//           e.preventDefault();
//           setDragActive(true);
//         }}
//         onDragLeave={() => setDragActive(false)}
//         onDrop={(e) => {
//           e.preventDefault();
//           setDragActive(false);
//           if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
//         }}
//         onClick={() => fileInputRef.current?.click()}
//         className={`mt-2 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
//           dragActive
//             ? "border-emerald-400 bg-emerald-500/5"
//             : "border-slate-800 hover:border-slate-700 bg-slate-950/40"
//         }`}
//       >
//         <input
//           ref={fileInputRef}
//           type="file"
//           className="hidden"
//           accept=".pdf,image/*"
//           onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
//         />

//         {encrypting ? (
//           <div className="flex flex-col items-center space-y-3">
//             <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
//             <p className="text-sm font-medium text-slate-200">
//               Encrypting file on device...
//             </p>
//             <p className="text-xs text-slate-400">
//               No plaintext touches the network wire
//             </p>
//           </div>
//         ) : (
//           <div className="flex flex-col items-center space-y-3 text-center">
//             <div className="p-4 bg-slate-900 border border-slate-800 rounded-full text-slate-300">
//               <UploadCloud className="w-8 h-8 text-cyan-400" />
//             </div>
//             <div>
//               <p className="text-sm font-medium text-slate-200">
//                 Click to browse or drop medical files here
//               </p>
//               <p className="text-xs text-slate-400 mt-1">
//                 Supports PDF, JPG, PNG (Auto-sealed with unique key)
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

import React, { useState, useRef } from "react";
import { Loader2 } from "lucide-react";
import { generateAESKey, exportKeyToBase64, encryptFile } from "../lib/crypto";
import { MedicalDocument } from "../types";

interface FileUploadCardProps {
  onUploadSuccess: (doc: MedicalDocument, rawKey: string) => void;
}

interface ServerUploadResponse {
  status: string;
  doc_id?: string;
  id?: string;
}

export const FileUploadCard: React.FC<FileUploadCardProps> = ({
  onUploadSuccess,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [encrypting, setEncrypting] = useState(false);
  const [category, setCategory] = useState("Blood Report");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setEncrypting(true);

    try {
      const key = await generateAESKey();
      const base64Key = await exportKeyToBase64(key);
      const { ciphertextBase64, ivBase64 } = await encryptFile(file, key);

      const res = await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          file_type: file.type || "application/pdf",
          file_category: category,
          ciphertext: ciphertextBase64,
          iv: ivBase64,
        }),
      });

      if (!res.ok) throw new Error("Upload failed on server");
      const data: ServerUploadResponse = await res.json();

      onUploadSuccess(
        {
          id: data.doc_id || data.id || String(Date.now()),
          filename: file.name,
          file_type: file.type,
          file_category: category,
          created_at: Date.now() / 1000,
        },
        base64Key,
      );
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Encryption or upload error";
      alert(errorMessage);
    } finally {
      setEncrypting(false);
    }
  };

  return (
    <div className="border border-zinc-900 bg-zinc-950 p-6 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
        <div>
          <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest block">
            Input Subsystem
          </span>
          <h3 className="font-mono text-xs uppercase tracking-wider text-zinc-200">
            Ingest Document
          </h3>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-zinc-900 px-2 py-0.5 border border-zinc-800 uppercase">
          AES-256 Armed
        </span>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-mono text-zinc-500 uppercase">
          Diagnostic Classification
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs px-3 py-2 font-mono focus:outline-none focus:border-zinc-700"
        >
          <option value="Blood Report">Hematology / Blood Chemistry</option>
          <option value="Diagnostic Scan">Imaging (MRI, CT Scan, X-Ray)</option>
          <option value="Prescription">Active Clinical Prescription</option>
          <option value="Discharge Summary">Hospital Discharge Summary</option>
        </select>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border border-dashed p-8 text-center cursor-pointer transition-colors ${
          dragActive
            ? "border-emerald-500 bg-emerald-950/10"
            : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/20"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,image/*"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {encrypting ? (
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
            <p className="text-xs font-mono text-zinc-400 uppercase">
              Encrypting In Browser Memory...
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-xs font-mono uppercase text-zinc-300">
              Drop Target Document or Click to Browse
            </p>
            <p className="text-[10px] font-mono text-zinc-600 uppercase">
              Binary is sealed in RAM prior to network transit
            </p>
          </div>
        )}
      </div>
    </div>
  );
};