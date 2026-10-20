import React from 'react';
import { X, Check, LayoutGrid } from 'lucide-react';

export interface DashboardWidgetConfig {
  id: string;
  label: string;
  description: string;
  visible: boolean;
}

interface WidgetCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  widgets: DashboardWidgetConfig[];
  onToggleWidget: (id: string) => void;
  onResetLayout: () => void;
}

export const WidgetCustomizerModal: React.FC<WidgetCustomizerModalProps> = ({
  isOpen,
  onClose,
  widgets,
  onToggleWidget,
  onResetLayout,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-white">Customize Executive Dashboard</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <p className="text-xs text-slate-400 leading-relaxed">
            Configure visible ESG KPI modules, telemetry monitors, and compliance verification panels for your enterprise view.
          </p>

          <div className="space-y-2 mt-3">
            {widgets.map(w => (
              <button
                key={w.id}
                onClick={() => onToggleWidget(w.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all flex items-start justify-between gap-3 ${
                  w.visible
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div>
                  <span className={`text-xs font-semibold block ${w.visible ? 'text-emerald-300' : 'text-slate-300'}`}>
                    {w.label}
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5 leading-tight">
                    {w.description}
                  </span>
                </div>
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center text-xs shrink-0 mt-0.5 ${
                    w.visible ? 'bg-emerald-500 text-slate-950 font-bold' : 'border border-slate-700'
                  }`}
                >
                  {w.visible && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <button
            onClick={onResetLayout}
            className="text-xs text-slate-400 hover:text-slate-200 underline underline-offset-4"
          >
            Reset to Default
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
          >
            Apply Layout
          </button>
        </div>
      </div>
    </div>
  );
};
