import React, { useEffect, useState } from 'react';
import { CryptographicVerificationResult } from '../../types/audit';
import { Tenant } from '../../types/tenant';
import { ShieldCheck, AlertOctagon, CheckCircle2, RefreshCw, X, ShieldAlert } from 'lucide-react';

interface ChainIntegrityVerifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant;
  onRunVerification: () => Promise<CryptographicVerificationResult>;
  onRestoreConsensus: () => void;
}

export const ChainIntegrityVerifierModal: React.FC<ChainIntegrityVerifierModalProps> = ({
  isOpen,
  onClose,
  tenant,
  onRunVerification,
  onRestoreConsensus,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<CryptographicVerificationResult | null>(null);

  const handleVerify = async () => {
    setIsRunning(true);
    // Slight simulated progression for UX polish
    await new Promise(r => setTimeout(r, 600));
    const res = await onRunVerification();
    setResult(res);
    setIsRunning(false);
  };

  useEffect(() => {
    if (isOpen) {
      handleVerify();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-semibold text-white">
              Cryptographic Audit Chain Integrity Verification
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {isRunning ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
              <p className="text-sm font-semibold text-white">Traversing SHA-256 Block Chain...</p>
              <p className="text-xs text-slate-400 max-w-sm">
                Recalculating payload hashes and validating cryptographic linkage from Genesis to latest block.
              </p>
            </div>
          ) : result ? (
            <div className="space-y-5">
              {/* Outcome Banner */}
              {result.isValid ? (
                <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-emerald-300">
                      Cryptographic Chain Verified Tamper-Proof
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                      All {result.totalBlocks} sequential blocks match their SHA-256 hash commitments. No records have been altered, injected, or dropped from {tenant.name}'s regulatory ledger.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-rose-950/30 border border-rose-500/40 rounded-xl p-4 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
                    <AlertOctagon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-rose-300">
                      Cryptographic Integrity Violation Detected!
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                      Chain broken at block index #{result.brokenBlockIndex}. An unauthorized alteration or out-of-band database update was detected that violates cryptographic consensus.
                    </p>
                    <button
                      onClick={() => {
                        onRestoreConsensus();
                        handleVerify();
                      }}
                      className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-200 bg-rose-900/40 hover:bg-rose-900/60 border border-rose-700/60 rounded-md transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Restore Consensus & Re-chain
                    </button>
                  </div>
                </div>
              )}

              {/* Block-by-Block Traversal Table */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Verified Blocks Sequence ({result.verifiedBlocks} / {result.totalBlocks})
                </h4>
                <div className="border border-slate-800 rounded-lg overflow-hidden max-h-60 overflow-y-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-sans">
                        <th className="py-2 px-3">Block #</th>
                        <th className="py-2 px-3">Action Type</th>
                        <th className="py-2 px-3">SHA-256 Commitment</th>
                        <th className="py-2 px-3 text-right">Integrity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-[11px]">
                      {result.blocks.map(b => (
                        <tr key={b.index} className={b.matches ? 'hover:bg-slate-800/20' : 'bg-rose-950/20'}>
                          <td className="py-2 px-3 text-slate-300 font-semibold tabular-nums">
                            #{b.index}
                          </td>
                          <td className="py-2 px-3 text-slate-400 font-sans">
                            {b.action}
                          </td>
                          <td className="py-2 px-3 text-slate-300">
                            {b.computedHash.slice(0, 16)}...
                          </td>
                          <td className="py-2 px-3 text-right">
                            {b.matches ? (
                              <span className="text-emerald-400 font-semibold flex items-center justify-end gap-1 font-sans">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Valid
                              </span>
                            ) : (
                              <span className="text-rose-400 font-bold flex items-center justify-end gap-1 font-sans">
                                <AlertOctagon className="w-3.5 h-3.5" />
                                Tampered
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Manifest Metadata */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-[11px] text-slate-400 font-mono space-y-1">
                <div>Genesis Block Hash: {result.genesisHash}</div>
                <div>Latest Block Hash: {result.latestHash}</div>
                <div>Verification Timestamp: {result.verifiedAt}</div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <button
            onClick={handleVerify}
            disabled={isRunning}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${isRunning ? 'animate-spin' : ''}`} />
            Re-run Verification
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
