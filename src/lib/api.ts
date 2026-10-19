export const API_BASE = 'http://localhost:8000/api';

export interface UploadRequest {
  filename: string;
  mime_type: string;
  ciphertext: string;
  iv: string;
}

export interface UploadResponse {
  doc_id: string;
  filename: string;
  uploaded_at: string;
}

export interface ShareRequest {
  doc_id: string;
  duration_seconds: number;
}

export interface ShareResponse {
  token: string;
  doc_id: string;
  expires_at: string;
  duration_seconds: number;
}

export interface RecordResponse {
  doc_id: string;
  filename: string;
  mime_type: string;
  ciphertext: string;
  iv: string;
  expires_at: string;
}

export interface AccessLog {
  id: number;
  timestamp: string;
  ip_address: string;
  access_status: 'SUCCESS' | 'EXPIRED';
  document_name: string;
}

export interface StoredDocument {
  doc_id: string;
  filename: string;
  mime_type: string;
  uploaded_at: string;
  exportedKeyBase64: string;
}

const DEFAULT_TIMEOUT = 15000;

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (res.status === 403) {
      throw new AccessDeniedError('Access denied or session expired');
    }

    if (res.status === 404) {
      throw new NotFoundError('Resource not found');
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new ApiError(body.detail ?? `Request failed (${res.status})`);
    }

    return res.json() as Promise<T>;
  } finally {
    clearTimeout(timeoutId);
  }
}

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export class AccessDeniedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AccessDeniedError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export async function uploadDocument(
  payload: UploadRequest
): Promise<UploadResponse> {
  return request<UploadResponse>(`${API_BASE}/upload`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function createShareLink(
  payload: ShareRequest
): Promise<ShareResponse> {
  return request<ShareResponse>(`${API_BASE}/share`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchRecord(
  token: string
): Promise<RecordResponse> {
  return request<RecordResponse>(`${API_BASE}/record/${token}`, {
    method: 'GET',
  });
}

export async function fetchLogs(): Promise<AccessLog[]> {
  return request<AccessLog[]>(`${API_BASE}/logs`, {
    method: 'GET',
  });
}
