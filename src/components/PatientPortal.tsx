// import { useState } from 'react';
// import FileUploadCard from './FileUploadCard';
// import DocumentList from './DocumentList';
// import ShareModal from './ShareModal';
// import AuditLogTable from './AuditLogTable';
// import type { StoredDocument } from '@/lib/api';

// export default function PatientPortal() {
//   const [documents, setDocuments] = useState<StoredDocument[]>([]);
//   const [shareDoc, setShareDoc] = useState<StoredDocument | null>(null);

//   const handleUploaded = (doc: StoredDocument) => {
//     setDocuments((prev) => [doc, ...prev]);
//   };

//   return (
//     <div className="space-y-6">
//       <div className="grid gap-6 lg:grid-cols-2">
//         <FileUploadCard onUploaded={handleUploaded} />
//         <DocumentList documents={documents} onShare={setShareDoc} />
//       </div>
//       <AuditLogTable />
//       <ShareModal document={shareDoc} onClose={() => setShareDoc(null)} />
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { Mic, HeartPulse } from "lucide-react";
import { FileUploadCard } from "./FileUploadCard";
import { DocumentList } from "./DocumentList";
import { ShareModal } from "./ShareModal";
import { AuditLogTable } from "./AuditLogTable";
import { MedicalDocument, AuditLogEntry, VoiceAIResponse } from "../types";

interface IWindowWithSpeech extends Window {
  SpeechRecognition?: {
    new (): ISpeechRecognitionInstance;
  };
  webkitSpeechRecognition?: {
    new (): ISpeechRecognitionInstance;
  };
}

interface ISpeechRecognitionInstance {
  lang: string;
  start: () => void;
  onresult: (event: ISpeechEvent) => void;
  onerror: () => void;
}

interface ISpeechEvent {
  results: Array<Array<{ transcript: string }>>;
}

export const PatientPortal: React.FC = () => {
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [keysMap, setKeysMap] = useState<Record<string, string>>({});
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [activeShareDoc, setActiveShareDoc] = useState<MedicalDocument | null>(
    null,
  );
  const [activeKey, setActiveKey] = useState<string>("");

  const [voiceListening, setVoiceListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [voiceProcessing, setVoiceProcessing] = useState(false);

  const fetchLogs = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/logs");
      if (res.ok) {
        const data: AuditLogEntry[] = await res.json();
        setLogs(data);
      }
    } catch {
      // Ignored for polling
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleUploadSuccess = (doc: MedicalDocument, key: string) => {
    setDocuments((prev) => [doc, ...prev]);
    setKeysMap((prev) => ({ ...prev, [doc.id]: key }));
    fetchLogs();
  };

  const triggerVoiceAssistant = () => {
    const customWindow = window as unknown as IWindowWithSpeech;
    const SpeechRecognition =
      customWindow.SpeechRecognition || customWindow.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Voice recognition is not supported in this browser. Please use Chrome or Edge.",
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.start();
    setVoiceListening(true);

    recognition.onresult = async (event: ISpeechEvent) => {
      const transcript = event.results[0][0].transcript;
      setVoiceTranscript(transcript);
      setVoiceListening(false);
      setVoiceProcessing(true);

      try {
        const res = await fetch("http://localhost:8000/api/ai/process-voice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript }),
        });

        if (res.ok) {
          const aiData: VoiceAIResponse = await res.json();
          const targetDoc =
            documents.find((d) => d.id === aiData.matched_document.id) ||
            documents[0];
          if (targetDoc && keysMap[targetDoc.id]) {
            setActiveShareDoc(targetDoc);
            setActiveKey(keysMap[targetDoc.id]);
          } else {
            alert(aiData.confirmation_message || "Document parsed from speech");
          }
        }
      } catch {
        alert("Failed to process voice command");
      } finally {
        setVoiceProcessing(false);
      }
    };

    recognition.onerror = () => {
      setVoiceListening(false);
      setVoiceProcessing(false);
    };
  };

  return (
    <div className="space-y-8">
      <div className="bg-linear-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 border border-emerald-500/30 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-400">
            <HeartPulse className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-100">
                Senior Citizen Voice Assistant
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                AI Powered
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Tap the mic and speak: "Share my blood test report with Dr. Gupta
              for 15 minutes"
            </p>
          </div>
        </div>

        <button
          onClick={triggerVoiceAssistant}
          disabled={voiceListening || voiceProcessing}
          className={`px-6 py-3.5 rounded-2xl font-semibold text-sm transition-all flex items-center gap-3 shadow-lg cursor-pointer ${
            voiceListening
              ? "bg-red-500 text-white animate-pulse"
              : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20"
          }`}
        >
          <Mic className="w-5 h-5" />
          {voiceListening
            ? "Listening now..."
            : voiceProcessing
              ? "Processing Speech..."
              : "Tap to Speak (Voice Share)"}
        </button>
      </div>

      {voiceTranscript && (
        <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono">
          Spoken: "{voiceTranscript}"
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <FileUploadCard onUploadSuccess={handleUploadSuccess} />
        <DocumentList
          documents={documents}
          keysMap={keysMap}
          onShare={(doc, key) => {
            setActiveShareDoc(doc);
            setActiveKey(key);
          }}
        />
      </div>

      <AuditLogTable logs={logs} onRefresh={fetchLogs} />

      {activeShareDoc && (
        <ShareModal
          document={activeShareDoc}
          encryptionKey={activeKey}
          onClose={() => {
            setActiveShareDoc(null);
            setActiveKey("");
          }}
        />
      )}
    </div>
  );
};