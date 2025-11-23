import React, { useState } from 'react';
import { MetricCard } from './MetricCard';
import { type OperationalMetrics, type QualityMetrics } from '../types';
import { CiCdPipeline } from './CiCdPipeline';
import { EvolutionEngine } from './EvolutionEngine';
import { ArchitectureBlueprint } from './ArchitectureBlueprint';

const mockOperationalMetrics: OperationalMetrics = {
  tokenConsumption: { value: 4892, unit: 'tokens' },
  toolLatency: { value: 876, unit: 'ms' },
  errorRate: { value: 1.2, unit: '%' },
  totalCost: { value: 0.78, unit: 'USD' },
};

const mockQualityMetrics: QualityMetrics = {
  guardrailTriggerRate: { value: 3.5, unit: '%' },
  ragHitRate: { value: 92.1, unit: '%' },
  userFeedbackScore: { value: 4.6, unit: '/5' },
  correctionRate: { value: 8.9, unit: '%' },
};


export const AgentOpsDashboard: React.FC = () => {
    const [view, setView] = useState<'operational' | 'quality' | 'deployments' | 'evolution' | 'architecture'>('architecture');

  const getButtonClass = (buttonView: typeof view) => {
    return `px-4 py-2 text-sm font-semibold rounded-md transition-colors ${view === buttonView ? 'bg-[var(--color-primary)] text-white' : 'hover:bg-[var(--color-background-tertiary)]'}`;
  }

  return (
    <div className="pb-24 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">AgentOps Dashboard</h2>
        <p className="text-[var(--color-text-secondary)] mt-2 max-w-2xl mx-auto">
          Monitoring the operational health, safety, and quality of the CreativeOps Agent in real-time.
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="bg-[var(--color-background-secondary)]/60 border border-[var(--color-border-primary)] rounded-lg p-1 flex items-center gap-2 flex-wrap">
            <button onClick={() => setView('architecture')} className={getButtonClass('architecture')}>
                Architecture
            </button>
            <button onClick={() => setView('operational')} className={getButtonClass('operational')}>
                Operational Metrics
            </button>
            <button onClick={() => setView('quality')} className={getButtonClass('quality')}>
                Quality & Trust
            </button>
             <button onClick={() => setView('deployments')} className={getButtonClass('deployments')}>
                Deployment Pipeline
            </button>
             <button onClick={() => setView('evolution')} className={getButtonClass('evolution')}>
                Evolution Engine
            </button>
        </div>
      </div>

      {view === 'architecture' && (
        <ArchitectureBlueprint />
      )}

      {view === 'operational' && (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard 
                title="Token Consumption / Task"
                value={mockOperationalMetrics.tokenConsumption.value}
                unit={mockOperationalMetrics.tokenConsumption.unit}
                iconPath="M8.25 7.5l.415-.415a.75.75 0 00-1.06-1.06L6.75 6.75v.586c0 .32.128.627.354.853l4.5 4.5a.75.75 0 101.06-1.06L12.415 11.5H15a.75.75 0 000-1.5H9.336a.75.75 0 01-.564-.235l-.002-.002z"
            />
             <MetricCard 
                title="Tool Latency (P95)"
                value={mockOperationalMetrics.toolLatency.value}
                unit={mockOperationalMetrics.toolLatency.unit}
                iconPath="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
             <MetricCard 
                title="Error Rate (Tool)"
                value={mockOperationalMetrics.errorRate.value}
                unit={mockOperationalMetrics.errorRate.unit}
                iconPath="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
             <MetricCard 
                title="Cost per Session"
                value={mockOperationalMetrics.totalCost.value}
                unit={mockOperationalMetrics.totalCost.unit}
                iconPath="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-15c-.621 0-1.125-.504-1.125-1.125v-9.75c0-.621.504-1.125 1.125-1.125h1.5"
            />
         </div>
      )}

      {view === 'quality' && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard 
                  title="Guardrail Trigger Rate"
                  value={mockQualityMetrics.guardrailTriggerRate.value}
                  unit={mockQualityMetrics.guardrailTriggerRate.unit}
                  iconPath="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
               <MetricCard 
                  title="RAG Hit Rate"
                  value={mockQualityMetrics.ragHitRate.value}
                  unit={mockQualityMetrics.ragHitRate.unit}
                  iconPath="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5"
              />
               <MetricCard 
                  title="User Feedback Score"
                  value={mockQualityMetrics.userFeedbackScore.value}
                  unit={mockQualityMetrics.userFeedbackScore.unit}
                  iconPath="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M9 15.75v3"
              />
               <MetricCard 
                  title="Correction Rate"
                  value={mockQualityMetrics.correctionRate.value}
                  unit={mockQualityMetrics.correctionRate.unit}
                  iconPath="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.182-3.182m0 0h-4.992"
              />
           </div>
      )}

      {view === 'deployments' && (
        <CiCdPipeline />
      )}

      {view === 'evolution' && (
        <EvolutionEngine />
      )}
    </div>
  );
};