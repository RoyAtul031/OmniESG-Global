import React from 'react';
import { FacilityEntity } from '../../types/entity';
import { AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react';

interface AnomalyAlertBannerProps {
  facilitiesWithAnomaly: FacilityEntity[];
  onInvestigate: (facility: FacilityEntity) => void;
}

export const AnomalyAlertBanner: React.FC<AnomalyAlertBannerProps> = ({
  facilitiesWithAnomaly,
  onInvestigate,
}) => {
  if (facilitiesWithAnomaly.length === 0) return null;

  return (
    <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-4 my-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-amber-300 uppercase tracking-wide">
                Automated Audit Anomaly Detected
              </span>
              <span className="text-[11px] text-amber-400/80 font-mono">
                ({facilitiesWithAnomaly.length} active flag{facilitiesWithAnomaly.length > 1 ? 's' : ''})
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              <strong className="text-amber-200">{facilitiesWithAnomaly[0].name}:</strong>{' '}
              {facilitiesWithAnomaly[0].anomalyNote || 'Activity readings deviated significantly from rolling 90-day baseline.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => onInvestigate(facilitiesWithAnomaly[0])}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors whitespace-nowrap shrink-0 self-start sm:self-center"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          Inspect Audit Trail Diff
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
