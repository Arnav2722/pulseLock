// export async function generateAESKey(): Promise<CryptoKey> {
//   return await window.crypto.subtle.generateKey(
//     { name: "AES-GCM", length: 256 },
//     true,
//     ["encrypt", "decrypt"],
//   );
// }

// export async function exportKeyToBase64(key: CryptoKey): Promise<string> {
//   const exported = await window.crypto.subtle.exportKey("raw", key);
//   const bytes = new Uint8Array(exported);
//   let binary = "";
//   for (let i = 0; i < bytes.byteLength; i++) {
//     binary += String.fromCharCode(bytes[i]);
//   }
//   return window.btoa(binary);
// }

// export async function importKeyFromBase64(
//   base64Key: string,
// ): Promise<CryptoKey> {
//   const binary = window.atob(base64Key);
//   const bytes = new Uint8Array(binary.length);
//   for (let i = 0; i < binary.length; i++) {
//     bytes[i] = binary.charCodeAt(i);
//   }
//   return await window.crypto.subtle.importKey(
//     "raw",
//     bytes.buffer,
//     { name: "AES-GCM", length: 256 },
//     true,
//     ["decrypt"],
//   );
// }

// export async function encryptFile(
//   file: File,
//   key: CryptoKey,
// ): Promise<{ ciphertextBase64: string; ivBase64: string }> {
//   const arrayBuffer = await file.arrayBuffer();
//   const iv = window.crypto.getRandomValues(new Uint8Array(12));

//   const encryptedBuffer = await window.crypto.subtle.encrypt(
//     { name: "AES-GCM", iv: iv },
//     key,
//     arrayBuffer,
//   );

//   const encBytes = new Uint8Array(encryptedBuffer);
//   let encBinary = "";
//   for (let i = 0; i < encBytes.byteLength; i++) {
//     encBinary += String.fromCharCode(encBytes[i]);
//   }

//   let ivBinary = "";
//   for (let i = 0; i < iv.byteLength; i++) {
//     ivBinary += String.fromCharCode(iv[i]);
//   }

//   return {
//     ciphertextBase64: window.btoa(encBinary),
//     ivBase64: window.btoa(ivBinary),
//   };
// }

// export async function decryptFile(
//   ciphertextBase64: string,
//   ivBase64: string,
//   key: CryptoKey,
// ): Promise<ArrayBuffer> {
//   const cipherBinary = window.atob(ciphertextBase64);
//   const cipherBytes = new Uint8Array(cipherBinary.length);
//   for (let i = 0; i < cipherBinary.length; i++) {
//     cipherBytes[i] = cipherBinary.charCodeAt(i);
//   }

//   const ivBinary = window.atob(ivBase64);
//   const ivBytes = new Uint8Array(ivBinary.length);
//   for (let i = 0; i < ivBytes.byteLength; i++) {
//     ivBytes[i] = ivBinary.charCodeAt(i);
//   }

//   return await window.crypto.subtle.decrypt(
//     { name: "AES-GCM", iv: ivBytes },
//     key,
//     cipherBytes.buffer,
//   );
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
    { name: "AES-GCM", iv },
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
  for (let i = 0; i < ivBinary.length; i++) {
    ivBytes[i] = ivBinary.charCodeAt(i);
  }

  return await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: ivBytes },
    key,
    cipherBytes.buffer,
  );
}