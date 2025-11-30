
import React from 'react';
import { useAgentContext } from '../contexts/AgentContext';
import { Icon } from './Icon';

const statusConfig: Record<string, { color: string; icon: string; animate?: boolean }> = {
    PENDING: { color: 'text-yellow-400', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z', animate: true },
    APPROVED: { color: 'text-green-400', icon: 'M9 12.75L11.25 15 15 9.75' },
    REJECTED: { color: 'text-red-400', icon: 'M6 18L18 6M6 6l12 12' },
    CONDITIONAL_APPROVAL: { color: 'text-amber-500', icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z' },
    COMPLETE: { color: 'text-blue-400', icon: 'M9 12.75L11.25 15 15 9.75' },
    IN_PROGRESS: { color: 'text-cyan-400', icon: 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.182-3.182m0 0h-4.992', animate: true },
};

export const AgentSwarmList: React.FC = () => {
  const { state } = useAgentContext();
  const { a2aMonitor } = state;

  // Default Agents if none are active yet (Idle State)
  const agents = a2aMonitor.length > 0 ? a2aMonitor : [
      { service: 'Orchestrator', status: 'IDLE', identity_verified: true },
      { service: 'Creative', status: 'IDLE', identity_verified: true },
      { service: 'Brand Guard', status: 'IDLE', identity_verified: true },
      { service: 'Legal', status: 'IDLE', identity_verified: true },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6 opacity-70">
          <Icon path="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" className="w-4 h-4 text-[var(--color-primary)]" />
          <h2 className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">Active Swarm</h2>
      </div>
      
      <div className="space-y-3">
        {agents.map((agent, idx) => {
          const config = statusConfig[agent.status] || { color: 'text-zinc-600', icon: 'M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z' };
          const isActive = agent.status !== 'IDLE';

          return (
            <div key={idx} className="group flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors cursor-default">
              <div className="flex items-center gap-3">
                <div className={`relative flex items-center justify-center w-8 h-8 rounded-lg bg-black/40 border border-[var(--color-border-primary)] transition-all ${isActive ? 'shadow-[0_0_10px_rgba(0,0,0,0.5)]' : 'opacity-50'}`}>
                    <Icon path={config.icon} className={`w-4 h-4 ${config.color} ${config.animate ? 'animate-spin' : ''}`} />
                    {/* Status Dot */}
                    {isActive && (
                        <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${config.color.replace('text-', 'bg-')} shadow-[0_0_5px_currentColor]`}></div>
                    )}
                </div>
                <div className="flex flex-col">
                    <span className={`text-sm font-medium ${isActive ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'}`}>
                        {agent.service}
                    </span>
                    <span className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-wider">
                        {agent.status.replace('_', ' ')}
                    </span>
                </div>
              </div>
              
              {agent.identity_verified && (
                <div className="relative group/tooltip">
                   <Icon path="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" className="w-4 h-4 text-emerald-500/50 group-hover:text-emerald-400 transition-colors" />
                   
                   {/* Tooltip */}
                   <div className="absolute right-0 top-6 w-48 p-2 bg-black border border-emerald-900 rounded shadow-xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-50">
                       <p className="text-[10px] text-emerald-400 font-mono">
                           Verified ID: <br/> spiffe://cluster.local/ns/agent-{agent.service.toLowerCase().replace(' ', '-')}
                       </p>
                   </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-auto pt-6 border-t border-[var(--color-border-primary)]">
          <div className="flex items-center gap-2 p-2 rounded bg-white/5 border border-white/5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-mono text-[var(--color-text-secondary)]">Mesh Network: Stable</span>
          </div>
      </div>
    </div>
  );
};
