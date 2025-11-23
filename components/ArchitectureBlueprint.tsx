import React from 'react';
import { Icon } from './Icon';

const blueprintData = [
  {
    pillar: 'Cognitive Design',
    choice: 'Hierarchical CoT/ToT',
    implementation: 'Metaprompt (<cognitive_pipeline>)',
  },
  {
    pillar: 'Memory',
    choice: 'Implicit Tracking → Confirmed Learning',
    implementation: 'log_implicit_preference & confirm_and_save_profile',
  },
  {
    pillar: 'Efficiency/Routing',
    choice: 'Parallel Execution → Model Router',
    implementation: 'B.E. Model Router (Flash for Judge, Pro for Creation)',
  },
  {
    pillar: 'Resilience',
    choice: 'Self-Correction → Tool Failover',
    implementation: 'B.E. Resilient Tool Wrapper (<error_handling_protocol>)',
  },
  {
    pillar: 'Governance/QA',
    choice: 'LLM-as-a-Judge & Trajectory Trace',
    implementation: 'Metaprompt (<a2ui_api_contract>)',
  },
  {
    pillar: 'Automation/Evolve',
    choice: 'Automated Prompt Refinement & A-RAG',
    implementation: 'CI/CD Script (test_agent_quality.py)',
  },
];

export const ArchitectureBlueprint: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto">
       <div className="bg-[var(--color-background-secondary)] border border-[var(--color-border-primary)] rounded-lg p-6">
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--gradient-primary)]">
                    <Icon path="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" className="w-5 h-5 text-white" />
                </div>
                Agent System Architecture Blueprint
            </h3>
            <p className="text-[var(--color-text-secondary)] text-sm mb-6">This table outlines the core design pillars and strategic choices that define the CreativeOps-1 agent. Each pillar connects a high-level architectural strategy to its specific implementation within the system's metaprompt or backend services.</p>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-[var(--color-text-secondary)]">
                    <thead className="text-xs text-[var(--color-text-accent)] uppercase bg-[var(--color-background-tertiary)]/50">
                        <tr>
                            <th scope="col" className="px-6 py-3 rounded-tl-lg">Pillar</th>
                            <th scope="col" className="px-6 py-3">Strategic Choice</th>
                            <th scope="col" className="px-6 py-3 rounded-tr-lg">Implementation / Code Specification</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blueprintData.map((item, index) => (
                            <tr key={index} className="border-b border-[var(--color-border-primary)] hover:bg-[var(--color-background-secondary)]/40">
                                <td className="px-6 py-4 font-semibold text-[var(--color-text-primary)]">{item.pillar}</td>
                                <td className="px-6 py-4">{item.choice}</td>
                                <td className="px-6 py-4 font-mono">
                                    <code className="bg-black/40 px-2 py-1 rounded">{item.implementation}</code>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
       </div>
    </div>
  );
};