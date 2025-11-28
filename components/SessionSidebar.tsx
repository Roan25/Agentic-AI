import React from 'react';
import { Icon } from './Icon';

interface SessionSidebarProps {
  sessions: { id: string; title: string; date: string }[];
  activeSessionId: string | null;
  onNewSession: () => void;
  onOpenSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
}

const RecentSessionItem: React.FC<{
    session: { id: string; title: string; date: string };
    active?: boolean;
    onOpen: (id: string) => void;
    onDelete: (id: string) => void;
}> = ({ session, active, onOpen, onDelete }) => (
    <div className={`group w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 cursor-pointer mb-2 border ${active ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)]/30 shadow-[var(--shadow-glow)]' : 'border-transparent hover:bg-white/5'}`} onClick={() => onOpen(session.id)}>
        <div className="flex-1 min-w-0 pr-2">
            <p className={`text-sm font-medium truncate ${active ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]'}`}>{session.title}</p>
            <p className="text-[10px] text-[var(--color-text-secondary)] opacity-60 uppercase tracking-wider">{session.date}</p>
        </div>
        <button
            onClick={(e) => { e.stopPropagation(); onDelete(session.id); }}
            className="p-1.5 rounded-full text-[var(--color-text-secondary)] opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 transition-all"
        >
            <Icon path="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" className="w-3.5 h-3.5" />
        </button>
    </div>
);

export const SessionSidebar: React.FC<SessionSidebarProps> = ({ sessions, activeSessionId, onNewSession, onOpenSession, onDeleteSession }) => {
  return (
    <div className="flex flex-col h-full">
        <button
            onClick={onNewSession}
            className="w-full mb-6 py-3 px-4 rounded-xl border border-dashed border-[var(--color-border-primary)] text-[var(--color-text-secondary)] hover:text-white hover:border-[var(--color-text-primary)] hover:bg-white/5 transition-all flex items-center justify-center gap-2 group"
        >
            <div className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                 <Icon path="M12 4.5v15m7.5-7.5h-15" className="w-4 h-4" />
            </div>
            <span className="font-semibold text-sm">New Project</span>
        </button>
        
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <h3 className="text-xs font-heading font-bold uppercase text-[var(--color-text-secondary)] tracking-widest mb-4 pl-2 opacity-50">History</h3>
            {sessions.map(session => (
                <RecentSessionItem
                    key={session.id}
                    session={session}
                    active={session.id === activeSessionId}
                    onOpen={onOpenSession}
                    onDelete={onDeleteSession}
                />
            ))}
        </div>
    </div>
  );
};