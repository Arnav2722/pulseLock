// import { useCallback, useRef, useState } from 'react';
// import {
//   Upload,
//   FileText,
//   ImageIcon,
//   ShieldCheck,
//   Loader2,
//   AlertCircle,
//   Lock,
// } from 'lucide-react';
// import { encryptFile, detectMimeType, type EncryptionResult } from '@/lib/crypto';
// import { uploadDocument, ApiError } from '@/lib/api';
// import type { StoredDocument } from '@/lib/api';

// interface FileUploadCardProps {
//   onUploaded: (doc: StoredDocument) => void;
// }

// type UploadStage = 'idle' | 'encrypting' | 'uploading' | 'success' | 'error';

// export default function FileUploadCard({ onUploaded }: FileUploadCardProps) {
//   const [isDragging, setIsDragging] = useState(false);
//   const [stage, setStage] = useState<UploadStage>('idle');
//   const [errorMsg, setErrorMsg] = useState('');
//   const [currentFileName, setCurrentFileName] = useState('');
//   const inputRef = useRef<HTMLInputElement>(null);

//   const handleFile = useCallback(
//     async (file: File) => {
//       setCurrentFileName(file.name);
//       setStage('encrypting');
//       setErrorMsg('');

//       try {
//         const result: EncryptionResult = await encryptFile(file);
//         setStage('uploading');

//         const response = await uploadDocument({
//           filename: file.name,
//           mime_type: detectMimeType(file.name),
//           ciphertext: result.ciphertextBase64,
//           iv: result.ivBase64,
//         });

//         const stored: StoredDocument = {
//           doc_id: response.doc_id,
//           filename: file.name,
//           mime_type: detectMimeType(file.name),
//           uploaded_at: response.uploaded_at,
//           exportedKeyBase64: result.exportedKeyBase64,
//         };

//         onUploaded(stored);
//         setStage('success');
//         setTimeout(() => setStage('idle'), 2000);
//       } catch (err) {
//         const msg =
//           err instanceof ApiError
//             ? err.message
//             : err instanceof Error
//               ? err.message
//               : 'Encryption or upload failed';
//         setErrorMsg(msg);
//         setStage('error');
//         setTimeout(() => setStage('idle'), 4000);
//       }
//     },
//     [onUploaded]
//   );

//   const onDrop = useCallback(
//     (e: React.DragEvent) => {
//       e.preventDefault();
//       setIsDragging(false);
//       const file = e.dataTransfer.files[0];
//       if (file) handleFile(file);
//     },
//     [handleFile]
//   );

//   const isImage = (name: string) =>
//     /\.(png|jpe?g|gif|webp|bmp|tiff?)$/i.test(name);
//   const isPdf = (name: string) => /\.pdf$/i.test(name);

//   const isBusy = stage === 'encrypting' || stage === 'uploading';

//   return (
//     <div className="glass-card glass-card-hover p-6 animate-slide-up">
//       <div className="flex items-center gap-3 mb-4">
//         <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
//           <ShieldCheck className="w-5 h-5 text-emerald-400" />
//         </div>
//         <div>
//           <h2 className="text-lg font-semibold text-slate-100">
//             Encrypted Upload
//           </h2>
//           <p className="text-xs text-slate-400">
//             Files are encrypted with AES-GCM 256-bit before leaving your browser
//           </p>
//         </div>
//       </div>

//       <div
//         onDragOver={(e) => {
//           e.preventDefault();
//           setIsDragging(true);
//         }}
//         onDragLeave={() => setIsDragging(false)}
//         onDrop={onDrop}
//         onClick={() => !isBusy && inputRef.current?.click()}
//         className={`
//           relative border-2 border-dashed rounded-xl p-8 cursor-pointer
//           transition-all duration-200 text-center
//           ${
//             isDragging
//               ? 'border-emerald-500 bg-emerald-500/5'
//               : 'border-slate-700 hover:border-slate-600'
//           }
//           ${isBusy ? 'cursor-wait opacity-70' : ''}
//         `}
//       >
//         <input
//           ref={inputRef}
//           type="file"
//           accept=".pdf,.png,.jpg,.jpeg,.gif,.webp,.bmp,.tiff,.tif,.dcm"
//           className="hidden"
//           onChange={(e) => {
//             const file = e.target.files?.[0];
//             if (file) handleFile(file);
//             e.target.value = '';
//           }}
//         />

//         {stage === 'idle' && (
//           <div className="space-y-3">
//             <div className="flex justify-center gap-2">
//               <FileText className="w-8 h-8 text-slate-500" />
//               <ImageIcon className="w-8 h-8 text-slate-500" />
//             </div>
//             <div>
//               <p className="text-slate-300 font-medium">
//                 Drop medical files here or click to browse
//               </p>
//               <p className="text-xs text-slate-500 mt-1">
//                 PDF, PNG, JPG, DICOM — encrypted locally before upload
//               </p>
//             </div>
//           </div>
//         )}

//         {stage === 'encrypting' && (
//           <div className="space-y-3">
//             <div className="flex justify-center">
//               <Lock className="w-8 h-8 text-emerald-400 animate-pulse" />
//             </div>
//             <p className="text-emerald-400 font-medium">
//               Encrypting "{currentFileName}" with AES-GCM 256-bit...
//             </p>
//             <p className="text-xs text-slate-500">
//               Generating random IV and encryption key in Web Crypto API
//             </p>
//           </div>
//         )}

//         {stage === 'uploading' && (
//           <div className="space-y-3">
//             <div className="flex justify-center">
//               <Loader2 className="w-8 h-8 text-emerald-400 animate-spin-slow" />
//             </div>
//             <p className="text-slate-300 font-medium">
//               Sending encrypted ciphertext to server...
//             </p>
//             <p className="text-xs text-slate-500">
//               Only encrypted data is transmitted — the key stays in your browser
//             </p>
//           </div>
//         )}

//         {stage === 'success' && (
//           <div className="space-y-3">
//             <div className="flex justify-center">
//               <ShieldCheck className="w-8 h-8 text-emerald-400" />
//             </div>
//             <p className="text-emerald-400 font-medium">
//               Upload complete — document secured
//             </p>
//           </div>
//         )}

//         {stage === 'error' && (
//           <div className="space-y-3">
//             <div className="flex justify-center">
//               <AlertCircle className="w-8 h-8 text-red-400" />
//             </div>
//             <p className="text-red-400 font-medium">Upload failed</p>
//             <p className="text-xs text-slate-500">{errorMsg}</p>
//           </div>
//         )}
//       </div>

//       {currentFileName && stage !== 'idle' && stage !== 'error' && (
//         <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
//           {isImage(currentFileName) ? (
//             <ImageIcon className="w-3.5 h-3.5" />
//           ) : (
//             <FileText className="w-3.5 h-3.5" />
//           )}
//           <span className="truncate">{currentFileName}</span>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useRef } from "react";
import { UploadCloud, ShieldCheck, Lock, Loader2 } from "lucide-react";
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
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 text-lg">
              Secure Document Ingestion
            </h3>
            <p className="text-xs text-slate-400">
              Local AES-256-GCM zero-trust client encryption
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
          <Lock className="w-3.5 h-3.5" /> Client Encrypted
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <label className="text-xs text-slate-400 block md:col-span-1 self-center">
          Record Category:
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="md:col-span-3 bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 transition-colors"
        >
          <option value="Blood Report">Blood Report (CBC, Lipid, Sugar)</option>
          <option value="Diagnostic Scan">
            Scan / Imaging (MRI, CT, X-Ray)
          </option>
          <option value="Prescription">Doctor Prescription</option>
          <option value="Discharge Summary">Discharge Summary / EHR</option>
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
        className={`mt-2 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
          dragActive
            ? "border-emerald-400 bg-emerald-500/5"
            : "border-slate-800 hover:border-slate-700 bg-slate-950/40"
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
          <div className="flex flex-col items-center space-y-3">
            <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
            <p className="text-sm font-medium text-slate-200">
              Encrypting file on device...
            </p>
            <p className="text-xs text-slate-400">
              No plaintext touches the network wire
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3 text-center">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-full text-slate-300">
              <UploadCloud className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">
                Click to browse or drop medical files here
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supports PDF, JPG, PNG (Auto-sealed with unique key)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};