// import React from "react";
// import {
//   ArrowUpRight,
//   Shield,
//   Terminal,
//   Zap,
//   Lock,
//   EyeOff,
// } from "lucide-react";

// interface LandingPageProps {
//   onEnterApp: () => void;
// }

// export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
//   return (
//     <div className="space-y-20 py-6 max-w-6xl mx-auto">
//       {/* Editorial Hero */}
//       <section className="pt-10 border-b border-zinc-800/80 pb-16">
//         <div className="flex items-center gap-3 mb-6">
//           <span className="w-2 h-2 rounded-none bg-emerald-500 animate-pulse" />
//           <span className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase">
//             Protocol Specification // RFC-3986
//           </span>
//         </div>

//         <h1 className="text-4xl sm:text-6xl font-light tracking-tight text-zinc-100 max-w-3xl leading-none">
//           Client-side encrypted health record routing.
//         </h1>

//         <p className="mt-6 text-zinc-400 text-sm sm:text-base max-w-xl font-normal leading-relaxed">
//           Traditional health databases store plaintext diagnostics susceptible
//           to exfiltration. PulseLock executes non-custodial AES-GCM encryption
//           in the browser sandbox, serving ephemeral view windows with
//           zero-knowledge persistence.
//         </p>

//         <div className="mt-8 flex flex-wrap items-center gap-4">
//           <button
//             onClick={onEnterApp}
//             className="px-6 py-3 bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs tracking-wide uppercase transition-all flex items-center gap-2 cursor-pointer"
//           >
//             <span>Initialize Vault</span>
//             <ArrowUpRight className="w-3.5 h-3.5" />
//           </button>

//           <div className="px-4 py-3 border border-zinc-800 text-[11px] font-mono text-zinc-400">
//             ENGINE STATUS: DECENTRALIZED_ACTIVE
//           </div>
//         </div>
//       </section>

//       {/* Architectural Specs - Clean Grid */}
//       <section className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-800/80 border-t border-b border-zinc-800/80">
//         <div className="py-8 md:px-8 first:pl-0 space-y-3">
//           <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
//             01 // CRYPTOGRAPHY
//           </span>
//           <h3 className="text-sm font-semibold tracking-wide text-zinc-200 uppercase">
//             Local Web Crypto AES
//           </h3>
//           <p className="text-xs text-zinc-400 leading-relaxed font-normal">
//             Raw diagnostic payloads convert to ciphertext using 256-bit
//             Galois/Counter Mode before touching any network interface. Keys are
//             ephemeral to client memory.
//           </p>
//         </div>

//         <div className="py-8 md:px-8 space-y-3">
//           <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
//             02 // EXFILTRATION SHIELD
//           </span>
//           <h3 className="text-sm font-semibold tracking-wide text-zinc-200 uppercase">
//             Non-Custodial Sandbox
//           </h3>
//           <p className="text-xs text-zinc-400 leading-relaxed font-normal">
//             URI fragment-based secret distribution. PDF native toolbars, browser
//             print pipelines, and local disk write attempts are systematically
//             intercepted.
//           </p>
//         </div>

//         <div className="py-8 md:px-8 last:pr-0 space-y-3">
//           <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
//             03 // PROOF OF AUDIT
//           </span>
//           <h3 className="text-sm font-semibold tracking-wide text-zinc-200 uppercase">
//             HMAC Micro-Chaining
//           </h3>
//           <p className="text-xs text-zinc-400 leading-relaxed font-normal">
//             Every read event signs a SHA-256 HMAC chained to the prior log hash.
//             Mathematical verification detects retroactive database modification
//             instantly.
//           </p>
//         </div>
//       </section>

//       {/* Technical Comparison Sheet */}
//       <section className="space-y-6">
//         <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
//           <h2 className="text-xs font-mono tracking-widest text-zinc-400 uppercase">
//             System Benchmark vs Traditional EHR
//           </h2>
//           <span className="text-[10px] font-mono text-emerald-500">
//             AUDIT_COMPLIANT
//           </span>
//         </div>

//         <div className="border border-zinc-800 divide-y divide-zinc-800 text-xs font-mono">
//           <div className="grid grid-cols-3 p-4 bg-zinc-900/40 text-zinc-500 font-semibold uppercase text-[10px]">
//             <div>Capability</div>
//             <div>Centralized Cloud (AIIMS / Practo)</div>
//             <div className="text-emerald-400">PulseLock Protocol</div>
//           </div>
//           <div className="grid grid-cols-3 p-4 text-zinc-300">
//             <div className="text-zinc-400 font-sans">Storage State</div>
//             <div className="text-red-400/80">Plaintext Server DB</div>
//             <div className="text-emerald-400">Client-Side Ciphertext</div>
//           </div>
//           <div className="grid grid-cols-3 p-4 text-zinc-300">
//             <div className="text-zinc-400 font-sans">
//               Doctor Access Lifecycle
//             </div>
//             <div className="text-red-400/80">Permanent / Unrevoked</div>
//             <div className="text-emerald-400">Hard Expiration + RAM Purge</div>
//           </div>
//           <div className="grid grid-cols-3 p-4 text-zinc-300">
//             <div className="text-zinc-400 font-sans">Key Custody</div>
//             <div className="text-red-400/80">Platform Administrator</div>
//             <div className="text-emerald-400">Zero-Knowledge (User Owned)</div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

import React from "react";
import { ArrowUpRight } from "lucide-react";

interface LandingPageProps {
  onEnterApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  return (
    <div className="space-y-20 py-8 max-w-6xl mx-auto">
      <section className="pt-8 border-b border-zinc-900 pb-16">
        <div className="flex items-center gap-2 mb-6">
          <span className="w-1.5 h-1.5 bg-emerald-500" />
          <span className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase">
            Protocol Specification // RFC-3986
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-light tracking-tight text-zinc-100 max-w-3xl leading-tight">
          Client-side encrypted health record routing.
        </h1>

        <p className="mt-6 text-zinc-400 text-sm sm:text-base max-w-xl font-normal leading-relaxed">
          Traditional hospital databases store plaintext diagnostics vulnerable
          to ransomware attacks. PulseLock executes non-custodial AES-GCM
          encryption inside browser memory, distributing self-revoking passes
          with zero server knowledge.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            onClick={onEnterApp}
            className="px-6 py-3 bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs tracking-wider uppercase transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span>Initialize Vault</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          <div className="px-4 py-3 border border-zinc-900 text-[11px] font-mono text-zinc-500 uppercase">
            Status: Zero-Knowledge Active
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-900 border-t border-b border-zinc-900">
        <div className="py-8 md:px-8 first:pl-0 space-y-3">
          <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
            01 // CRYPTOGRAPHY
          </span>
          <h3 className="text-sm font-semibold tracking-wide text-zinc-200 uppercase font-mono">
            Web Crypto AES-256
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed font-normal">
            Raw diagnostic payloads convert to ciphertext using 256-bit
            Galois/Counter Mode before leaving browser space. Decryption keys
            are never stored on the server.
          </p>
        </div>

        <div className="py-8 md:px-8 space-y-3">
          <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
            02 // ACCESS CONTROL
          </span>
          <h3 className="text-sm font-semibold tracking-wide text-zinc-200 uppercase font-mono">
            Non-Exfiltration Sandbox
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed font-normal">
            Secret delivery via URI fragment hashes. Native print shortcuts,
            download prompts, and context menus are restricted to prevent
            unauthorized duplication.
          </p>
        </div>

        <div className="py-8 md:px-8 last:pr-0 space-y-3">
          <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
            03 // PROOF OF AUDIT
          </span>
          <h3 className="text-sm font-semibold tracking-wide text-zinc-200 uppercase font-mono">
            HMAC Micro-Chaining
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed font-normal">
            Every read attempt signs a SHA-256 HMAC chained to the prior log
            hash. Mathematical verification detects retroactive database
            alteration instantly.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
          <h2 className="text-xs font-mono tracking-widest text-zinc-500 uppercase">
            System Benchmark vs Traditional EHR
          </h2>
          <span className="text-[10px] font-mono text-emerald-500 uppercase">
            AUDIT_VERIFIED
          </span>
        </div>

        <div className="border border-zinc-900 divide-y divide-zinc-900 text-xs font-mono">
          <div className="grid grid-cols-3 p-4 bg-zinc-950 text-zinc-600 font-semibold uppercase text-[10px]">
            <div>Capability</div>
            <div>Centralized Cloud (AIIMS / Practo)</div>
            <div className="text-emerald-400">PulseLock Protocol</div>
          </div>
          <div className="grid grid-cols-3 p-4 text-zinc-300">
            <div className="text-zinc-500 font-sans">Storage State</div>
            <div className="text-red-400/80">Plaintext Server DB</div>
            <div className="text-emerald-400">Client-Side Ciphertext</div>
          </div>
          <div className="grid grid-cols-3 p-4 text-zinc-300">
            <div className="text-zinc-500 font-sans">
              Doctor Access Lifecycle
            </div>
            <div className="text-red-400/80">Permanent / Unrevoked</div>
            <div className="text-emerald-400">Hard Expiration + RAM Purge</div>
          </div>
          <div className="grid grid-cols-3 p-4 text-zinc-300">
            <div className="text-zinc-500 font-sans">Key Custody</div>
            <div className="text-red-400/80">Platform Administrator</div>
            <div className="text-emerald-400">Zero-Knowledge (User Owned)</div>
          </div>
        </div>
      </section>
    </div>
  );
};