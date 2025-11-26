import React from 'react';
import { UiComponent, UiComponentType } from '../types';
import { Icon } from './Icon';

interface StatusBarProps {
    component: UiComponent;
}

// FIX: Define a type for status configurations to include the optional 'animate' property, resolving a TypeScript error.
type StatusConfigValue = {
    icon: string;
    color: string;
    bgColor: string;
    animate?: string;
};

const statusConfig: Record<string, StatusConfigValue> = {
    PENDING: {
        icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
        color: 'text-gray-400',
        bgColor: 'bg-gray-700/50',
    },
    IN_PROGRESS: {
        icon: 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.182-3.182m0 0h-4.992',
        color: 'text-blue-300',
        bgColor: 'bg-blue-800/40',
        animate: 'animate-spin',
    },
    COMPLETE: {
        icon: 'M9 12.75L11.25 15 15 9.75',
        color: 'text-green-300',
        bgColor: 'bg-green-800/40',
    },
    FAILED: {
        icon: 'M6 18L18 6M6 6l12 12',
        color: 'text-red-300',
        bgColor: 'bg-red-800/40',
    },
    BLOCKED: {
        icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636',
        color: 'text-red-300',
        bgColor: 'bg-red-800/40',
    },
     APPROVED: {
        icon: 'M9 12.75L11.25 15 15 9.75',
        color: 'text-green-300',
        bgColor: 'bg-green-800/40',
    },
};

export const StatusBar: React.FC<StatusBarProps> = ({ component }) => {
    const status = component.component_data.status || 'PENDING';
    const config = statusConfig[status] || statusConfig.PENDING;

    // Extract service from a2a_status if available, otherwise use a generic title
    const serviceTitle = component.a2a_status?.[0]?.service || (component.component_type === UiComponentType.SYSTEM_ALERT ? "System Alert" : "Agent Operation");
    const message = component.component_data.message || component.component_data.reason || "Status update";

    return (
        <div className={`flex items-center gap-4 p-3 rounded-lg border border-[var(--color-border-primary)]/80 ${config.bgColor}`}>
            <div className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full ${config.color} bg-black/30`}>
                <Icon path={config.icon} className={`w-5 h-5 ${config.animate || ''}`} />
            </div>
            <div className="flex-grow">
                <p className={`font-semibold ${config.color}`}>{serviceTitle}</p>
                <p className="text-sm text-[var(--color-text-secondary)]">{message}</p>
            </div>
            <p className={`text-xs font-semibold uppercase px-2 py-1 rounded-md ${config.bgColor} ${config.color}`}>
                {status.replace(/_/g, ' ')}
            </p>
        </div>
    );
};