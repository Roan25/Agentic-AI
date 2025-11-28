import React from 'react';
import { motion } from 'framer-motion';
import { UiComponent, UiComponentType, CreativeConcept } from '../types';
import { ConceptSelector } from './ConceptSelector';
import { JobProgress } from './JobProgress';
import { MemoryConsent } from './MemoryConsent';
import { WorkflowTracker } from './WorkflowTracker';
import { Icon } from './Icon';

interface A2UIRendererProps {
  payload: UiComponent;
  onAction?: (action: string, data: any) => void;
}

export const A2UIRenderer: React.FC<A2UIRendererProps> = ({ payload, onAction }) => {
  
  const renderComponent = () => {
    switch (payload.component_type) {
      case UiComponentType.SELECTION_CARD:
      case 'SelectionCard':
        return (
          <ConceptSelector 
            data={payload.component_data as any} 
            onSelect={(concept: CreativeConcept) => onAction && onAction('SELECT_CONCEPT', concept)} 
          />
        );
      
      case UiComponentType.ASYNC_STATUS_BAR:
      case 'AsyncStatusBar':
        return (
            <JobProgress 
                jobId={payload.component_data.job_id} 
                status={payload.component_data.status} 
                onJobComplete={(url) => onAction && onAction('JOB_COMPLETE', { url, jobId: payload.component_data.job_id })}
            />
        );
      
      case UiComponentType.PERMISSION_TOGGLE:
      case 'PermissionToggle':
        return (
            <MemoryConsent 
                pattern={payload.component_data.pattern_to_save} 
                onConfirm={() => onAction && onAction('SAVE_MEMORY', payload.component_data)}
                onDecline={() => onAction && onAction('DECLINE_MEMORY', null)}
            />
        );
        
      case UiComponentType.SYSTEM_ALERT:
      case 'SystemAlert':
          return (
              <div className="bg-red-500/10 border border-red-500/30 text-red-200 p-4 rounded-lg flex items-start gap-3">
                  <Icon path="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <div>
                      <h4 className="font-bold text-sm">System Alert</h4>
                      <p className="text-sm opacity-90">{payload.component_data.message || payload.component_data.reason}</p>
                  </div>
              </div>
          );

      case UiComponentType.TEXT:
      case 'Text':
      default:
        // Default text markdown renderer (simplified)
        return (
            <div className="text-[var(--color-text-primary)] leading-relaxed whitespace-pre-wrap">
                {payload.component_data.message || JSON.stringify(payload.component_data)}
            </div>
        );
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="w-full my-6"
    >
      {/* 2. The Agentic Wrapper */}
      <div className="border border-[var(--color-border-primary)] bg-[var(--color-background-glass)] backdrop-blur-xl rounded-xl p-1 shadow-xl overflow-hidden">
        
        {/* Inner Container */}
        <div className="flex flex-col md:flex-row items-stretch">
            
            {/* Main Content Area */}
            <div className="flex-1 p-5">
                {/* Header: Show which sub-agent is active */}
                <div className="flex items-center gap-2 mb-4 text-xs font-mono uppercase tracking-widest text-[var(--color-primary)]">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse"/>
                    CreativeOps-1 Active
                </div>

                {/* The Dynamic Content */}
                {renderComponent()}
            </div>

            {/* Sidebar Workflow Tracker (if status exists) */}
            {payload.a2a_status && payload.a2a_status.length > 0 && (
                <WorkflowTracker statuses={payload.a2a_status} />
            )}
        </div>

      </div>
    </motion.div>
  );
};
