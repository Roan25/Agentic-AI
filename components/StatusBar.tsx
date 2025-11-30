import React from 'react';
import { UiComponent, UiComponentType } from '../types';
import { Icon } from './Icon';

interface StatusBarProps {
    component: UiComponent;
}

type StatusConfigValue = {
    icon: string;
    color: string;
    borderColor: string;
    bgColor: string;
    animate?: string;
};

const statusConfig: Record<string, StatusConfigValue> = {
    PENDING: {
        icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
        color: 'text-zinc-400',
        borderColor: 'border-zinc-800',
        bgColor: 'bg-zinc-900/50',
    },
    IN_PROGRESS: {
        icon: 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.182-3.182m0 0h-4.992',
        color: 'text-cyan-400',
        borderColor: 'border-cyan-900',
        bgColor: 'bg-cyan-950/30',
        animate: 'animate-spin',
    },
    COMPLETE: {
        icon: 'M9 12.75L11.25 15 15 9.75',
        color: 'text-emerald-400',
        borderColor: 'border-emerald-900',
        bgColor: 'bg-emerald-950/30',
    },
    FAILED: {
        icon: 'M6 18L18 6M6 6l12 12',
        color: 'text-rose-400',
        borderColor: 'border-rose-900',
        bgColor: 'bg-rose-950/30',
    },
    BLOCKED: {
        icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636',
        color: 'text-rose-400',
        borderColor: 'border-rose-900',
        bgColor: 'bg-rose-950/30',
    },
    APPROVED: {
        icon: 'M9 12.75L11.25 15 15 9.75',
        color: 'text-emerald-400',
        borderColor: 'border-emerald-900',
        bgColor: 'bg-emerald-950/30',
    },
    CONDITIONAL_APPROVAL: {
        icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
        color: 'text-amber-500',
        borderColor: 'border-amber-500/50',
        bgColor: 'bg-amber-950/30',
    },
    MAINTENANCE: {
        icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
        color: 'text-orange-500',
        borderColor: 'border-orange-500/50',
        bgColor: 'bg-orange-950/30',
    }
};

export const StatusBar: React.FC<StatusBarProps> = ({ component }) => {
    const status = component.component_data.status || 'PENDING';
    const config = statusConfig[status] || statusConfig.PENDING;

    const serviceTitle = component.a2a_status?.[0]?.service || (component.component_type === UiComponentType.SYSTEM_ALERT ? "System Alert" : "Agent Operation");
    const message = component.component_data.message || component.component_data.reason || "Status update";

    return (
        <div className={`flex items-start gap-3 p-3 rounded border ${config.borderColor} ${config.bgColor} font-mono text-xs transition-all`}>
            <div className={`flex-shrink-0 mt-0.5`}>
                <Icon path={config.icon} className={`w-4 h-4 ${config.color} ${config.animate || ''}`} />
            </div>
            <div className="flex-grow">
                <div className="flex justify-between items-center mb-1">
                    <span className={`font-bold uppercase tracking-wider ${config.color}`}>{serviceTitle}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] bg-black/40 ${config.color}`}>
                        {status}
                    </span>
                </div>
                <p className="text-zinc-400 leading-relaxed">{message}</p>
            </div>
        </div>
    );
};