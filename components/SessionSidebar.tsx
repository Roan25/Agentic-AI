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
    <div className={`group w-full text-left p-3 rounded-lg transition-colors flex justify-between items-center ${active ? 'bg-[var(--color-background-tertiary)]' : 'hover:bg-[var(--color-background-tertiary)]'}`}>
        <button onClick={() => onOpen(session.id)} className="flex-grow text-left overflow-hidden">
            <p className="font-semibold text-sm truncate text-[var(--color-text-primary)]">{session.title}</p>
            <p className="text-xs text-[var(--color-text-secondary)]">{session.date}</p>
        </button>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center flex-shrink-0">
            <button
                onClick={(e) => { e.stopPropagation(); onOpen(session.id); }}
                className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                title="Open session"
            >
                <Icon path="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m-5.25 0h5.25v5.25" className="w-4 h-4" />
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); onDelete(session.id); }}
                className="p-1 text-[var(--color-text-secondary)] hover:text-red-400"
                title="Delete session"
            >
                <Icon path="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" className="w-4 h-4" />
            </button>
        </div>
    </div>
);

export const SessionSidebar: React.FC<SessionSidebarProps> = ({ sessions, activeSessionId, onNewSession, onOpenSession, onDeleteSession }) => {
  return (
    <aside className="w-64 flex-shrink-0 bg-[var(--color-background-secondary)] border border-[var(--color-border-primary)] rounded-xl p-4 flex-col gap-4 hidden md:flex">
        <button
            onClick={onNewSession}
            className="w-full bg-[var(--gradient-primary)] hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
        >
            <Icon path="M12 4.5v15m7.5-7.5h-15" className="w-5 h-5" />
            New Session
        </button>
        
        <div className="border-t border-[var(--color-border-primary)] my-2"></div>
        
        <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] px-2">Recent</h3>
        
        <div className="flex flex-col gap-2 overflow-y-auto">
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
    </aside>
  );
};