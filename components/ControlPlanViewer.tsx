import React from 'react';
import { UiComponent, UiComponentType } from '../types';
import { StatusBar } from './StatusBar';
import { Icon } from './Icon';

interface ControlPlanViewerProps {
  uiComponents: UiComponent[];
}

export const ControlPlanViewer: React.FC<ControlPlanViewerProps> = ({ uiComponents }) => {
  const statusComponents = uiComponents.filter(c => c.component_type === UiComponentType.ASYNC_STATUS_BAR || c.component_type === UiComponentType.SYSTEM_ALERT);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-[var(--color-background-secondary)] border border-[var(--color-border-primary)] rounded-lg p-6">
        <h3 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--gradient-primary)]">
            <Icon path="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" className="w-5 h-5 text-white" />
          </div>
          Live Agent Control Plan
        </h3>
        <p className="text-[var(--color-text-secondary)] text-sm mb-6">
          This view shows the real-time execution trace from the last agent run. Each step represents a tool call, an A2A (Agent-to-Agent) communication, or a system status update, providing full observability into the agent's decision-making process.
        </p>

        {statusComponents.length > 0 ? (
          <div className="space-y-3">
             <div className="flex justify-between items-center text-xs text-[var(--color-text-secondary)] uppercase tracking-wider px-1">
                <span>Step / Tool</span>
                <span>Status</span>
             </div>
            {statusComponents.map((bar, index) => (
                <div key={index} className="relative group">
                     {/* Connecting line */}
                     {index < statusComponents.length - 1 && (
                        <div className="absolute left-[19px] top-10 bottom-[-14px] w-0.5 bg-[var(--color-border-primary)] -z-10 group-hover:bg-[var(--color-primary)]/50 transition-colors"></div>
                     )}
                     <StatusBar component={bar} />
                </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-[var(--color-text-secondary)] bg-black/20 rounded-lg">
            <Icon path="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" className="w-12 h-12 mx-auto mb-4" />
            <p className="font-semibold">No recent agent activity.</p>
            <p className="text-sm mt-1">Run a new generation from the 'Creator' view to see the live trace here.</p>
          </div>
        )}
      </div>
    </div>
  );
};