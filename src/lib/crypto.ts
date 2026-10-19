// const ALGORITHM = 'AES-GCM';
// const KEY_LENGTH = 256;
// const IV_LENGTH = 12;

// export interface EncryptionResult {
//   ciphertextBase64: string;
//   ivBase64: string;
//   rawKey: CryptoKey;
//   exportedKeyBase64: string;
// }

// export interface DecryptionResult {
//   blob: Blob;
//   mimeType: string;
//   fileName: string;
// }

// export function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
//   const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
//   let binary = '';
//   for (let i = 0; i < bytes.byteLength; i++) {
//     binary += String.fromCharCode(bytes[i]);
//   }
//   return btoa(binary);
// }

// export function base64ToArrayBuffer(base64: string): ArrayBuffer {
//   const binary = atob(base64);
//   const bytes = new Uint8Array(binary.length);
//   for (let i = 0; i < binary.length; i++) {
//     bytes[i] = binary.charCodeAt(i);
//   }
//   return bytes.buffer;
// }

// export async function generateAESKey(): Promise<CryptoKey> {
//   return crypto.subtle.generateKey(
//     { name: ALGORITHM, length: KEY_LENGTH },
//     true,
//     ['encrypt', 'decrypt']
//   );
// }

// export async function exportKeyToBase64(key: CryptoKey): Promise<string> {
//   const exported = await crypto.subtle.exportKey('raw', key);
//   return arrayBufferToBase64(exported);
// }

// export async function importKeyFromBase64(base64: string): Promise<CryptoKey> {
//   const raw = base64ToArrayBuffer(base64);
//   return crypto.subtle.importKey('raw', raw, { name: ALGORITHM }, false, [
//     'decrypt',
//   ]);
// }

// export function generateIV(): Uint8Array {
//   return crypto.getRandomValues(new Uint8Array(IV_LENGTH));
// }

// export async function encryptFile(
//   file: File
// ): Promise<EncryptionResult> {
//   const key = await generateAESKey();
//   const iv = generateIV();
//   const fileBuffer = await file.arrayBuffer();

//   const ciphertext = await crypto.subtle.encrypt(
//     { name: ALGORITHM, iv },
//     key,
//     fileBuffer
//   );

//   const ivBase64 = arrayBufferToBase64(iv);
//   const ciphertextBase64 = arrayBufferToBase64(ciphertext);
//   const exportedKeyBase64 = await exportKeyToBase64(key);

//   return { ciphertextBase64, ivBase64, rawKey: key, exportedKeyBase64 };
// }

// export async function decryptFile(
//   ciphertextBase64: string,
//   ivBase64: string,
//   keyBase64: string
// ): Promise<ArrayBuffer> {
//   const key = await importKeyFromBase64(keyBase64);
//   const iv = new Uint8Array(base64ToArrayBuffer(ivBase64));
//   const ciphertext = base64ToArrayBuffer(ciphertextBase64);

//   return crypto.subtle.decrypt({ name: ALGORITHM, iv }, key, ciphertext);
// }

// export function detectMimeType(fileName: string): string {
//   const ext = fileName.toLowerCase().split('.').pop() ?? '';
//   const types: Record<string, string> = {
//     pdf: 'application/pdf',
//     png: 'image/png',
//     jpg: 'image/jpeg',
//     jpeg: 'image/jpeg',
//     gif: 'image/gif',
//     webp: 'image/webp',
//     bmp: 'image/bmp',
//     tiff: 'image/tiff',
//     tif: 'image/tiff',
//     dicom: 'application/dicom',
//     dcm: 'application/dicom',
//   };
//   return types[ext] ?? 'application/octet-stream';
// }

export async function generateAESKey(): Promise<CryptoKey> {
  return await window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );
}

export async function exportKeyToBase64(key: CryptoKey): Promise<string> {
  const exported = await window.crypto.subtle.exportKey("raw", key);
  const bytes = new Uint8Array(exported);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export async function importKeyFromBase64(
  base64Key: string,
): Promise<CryptoKey> {
  const binary = window.atob(base64Key);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return await window.crypto.subtle.importKey(
    "raw",
    bytes.buffer,
    { name: "AES-GCM", length: 256 },
    true,
    ["decrypt"],
  );
}

export async function encryptFile(
  file: File,
  key: CryptoKey,
): Promise<{ ciphertextBase64: string; ivBase64: string }> {
  const arrayBuffer = await file.arrayBuffer();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    arrayBuffer,
  );

  const encBytes = new Uint8Array(encryptedBuffer);
  let encBinary = "";
  for (let i = 0; i < encBytes.byteLength; i++) {
    encBinary += String.fromCharCode(encBytes[i]);
  }

  let ivBinary = "";
  for (let i = 0; i < iv.byteLength; i++) {
    ivBinary += String.fromCharCode(iv[i]);
  }

  return {
    ciphertextBase64: window.btoa(encBinary),
    ivBase64: window.btoa(ivBinary),
  };
}

export async function decryptFile(
  ciphertextBase64: string,
  ivBase64: string,
  key: CryptoKey,
): Promise<ArrayBuffer> {
  const cipherBinary = window.atob(ciphertextBase64);
  const cipherBytes = new Uint8Array(cipherBinary.length);
  for (let i = 0; i < cipherBinary.length; i++) {
    cipherBytes[i] = cipherBinary.charCodeAt(i);
  }

  const ivBinary = window.atob(ivBase64);
  const ivBytes = new Uint8Array(ivBinary.length);
  for (let i = 0; i < ivBytes.byteLength; i++) {
    ivBytes[i] = ivBinary.charCodeAt(i);
  }

  return await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: ivBytes },
    key,
    cipherBytes.buffer,
  );
}