// export interface MedicalDocument {
//   id: string;
//   filename: string;
//   file_type?: string;
//   file_category?: string;
//   created_at: number;
// }

// export interface AuditLogEntry {
//   id?: number;
//   token?: string;
//   doc_id?: string;
//   ip_address: string;
//   action?: string;
//   status: string;
//   timestamp: number;
//   previous_hash?: string;
//   current_hash?: string;
// }

// export interface DecryptedDocumentPayload {
//   filename: string;
//   file_type: string;
//   ciphertext: string;
//   iv: string;
//   doctor_alias?: string;
//   valid_until: number;
//   time_remaining_seconds: number;
// }

// export interface VoiceAIResponse {
//   status: string;
//   action: string;
//   matched_document: {
//     id: string;
//     filename: string;
//     file_category: string;
//   };
//   target_doctor: string;
//   duration_seconds: number;
//   confirmation_message: string;
// }

export interface MedicalDocument {
  id: string;
  filename: string;
  file_type?: string;
  file_category?: string;
  created_at: number;
}

export interface AuditLogEntry {
  id?: number;
  token?: string;
  doc_id?: string;
  ip_address: string;
  action?: string;
  status: string;
  timestamp: number;
  previous_hash?: string;
  current_hash?: string;
}

export interface DecryptedDocumentPayload {
  filename: string;
  file_type: string;
  ciphertext: string;
  iv: string;
  doctor_alias?: string;
  valid_until: number;
  time_remaining_seconds: number;
}

export interface VoiceAIResponse {
  status: string;
  action: string;
  matched_document: {
    id: string;
    filename: string;
    file_category: string;
  };
  target_doctor: string;
  duration_seconds: number;
  confirmation_message: string;
}