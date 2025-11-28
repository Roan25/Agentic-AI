import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from './Icon';
import { A2AStatus } from '../types';

interface WorkflowTrackerProps {
  statuses: A2AStatus[];
}

const statusConfig: Record<string, { color: string; icon: string }> = {
    PENDING: { color: 'text-yellow-400', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
    APPROVED: { color: 'text-green-400', icon: 'M9 12.75L11.25 15 15 9.75' },
    REJECTED: { color: 'text-red-400', icon: 'M6 18L18 6M6 6l12 12' },
    IN_PROGRESS: { color: 'text-blue-400', icon: 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.182-3.182m0 0h-4.992' },
};

export const WorkflowTracker: React.FC<WorkflowTrackerProps> = ({ statuses }) => {
  return (
    <div className="min-w-[200px] bg-[var(--color-background-tertiary)]/30 border-l border-[var(--color-border-primary)]/50 p-4 rounded-r-xl">
      <h5 className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] mb-4 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
        Live Swarm
      </h5>
      
      <div className="space-y-3">
        {statuses.map((agent, idx) => {
          const config = statusConfig[agent.status] || statusConfig.PENDING;
          const isPending = agent.status === 'PENDING' || agent.status === 'IN_PROGRESS';

          return (
            <div key={idx} className="flex items-center justify-between group">
              <div className="flex items-center gap-2">
                <div className={`relative flex items-center justify-center w-6 h-6 rounded-md bg-black/40 border border-[var(--color-border-primary)] ${isPending ? 'shadow-[0_0_8px_rgba(59,130,246,0.3)]' : ''}`}>
                    <Icon path={config.icon} className={`w-3.5 h-3.5 ${config.color} ${isPending ? 'animate-pulse' : ''}`} />
                </div>
                <span className={`text-xs font-medium ${isPending ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'}`}>
                    {agent.service}
                </span>
              </div>
              
              {agent.identity_verified && (
                <div title="SPIFFE Verified Identity">
                   <Icon path="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" className="w-3 h-3 text-[var(--color-accent)] opacity-60" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};