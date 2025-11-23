import React, { useState } from 'react';
import { Icon } from './Icon';

const CICD_BLUEPRINT = `
# Hypothetical CI/CD Pipeline (e.g., Cloud Build, GitHub Actions)

stages:
  - build
  - test
  - deploy

build:
  # 1. Package the Model Router Python code and tool wrappers.

test:
  # 2. Automated Golden Dataset Evaluation (The Quality Gate)
  script: |
    # Test 1: Run the Agent-as-a-Judge evaluation suite
    python test_agent_quality.py --golden_dataset=v3
    # Test 2: Check for prompt safety compliance (Safety Gate)
    python test_safety_check.py --config=master_prompt.xml

deploy:
  # 3. Safe Rollout Strategy
  - name: "Shadow Deployment"
    if: branch == "main"
    # Deploy to a low-traffic environment, set to discard output
    run: gcloud run deploy agent-v2-shadow --traffic-split=2
    
  - name: "Wait for Observability Review"
    # Requires human/automated review of Shadow metrics (Judge Score, Failover Rate)

  - name: "Final Production Rollout"
    if: branch == "main" and review == "APPROVED"
    # Promote the prompt/code to 100% of live traffic
    run: gcloud run deploy agent-v2-prod --traffic-split=100
`;

const PipelineStage: React.FC<{
  stageNumber: number;
  title: string;
  iconPath: string;
  children: React.ReactNode;
}> = ({ stageNumber, title, iconPath, children }) => (
  <div className="flex gap-6">
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-background-tertiary)] border-2 border-[var(--color-border-primary)]">
        <Icon path={iconPath} className="w-6 h-6 text-[var(--color-text-accent)]" />
      </div>
      <div className="w-0.5 h-full bg-[var(--color-border-primary)] my-2"></div>
    </div>
    <div className="flex-1 pb-10">
      <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
        <span className="text-[var(--color-text-secondary)]">Step {stageNumber}:</span> {title}
      </h3>
      <div className="mt-4 bg-[var(--color-background-secondary)] border border-[var(--color-border-primary)] rounded-lg p-6">
        {children}
      </div>
    </div>
  </div>
);

const QualityGate: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'running' | 'passed' | 'failed'>('idle');

    const handleRunTest = () => {
        setStatus('running');
        setTimeout(() => {
            // Simulate a test result
            const success = Math.random() > 0.2; // 80% chance to pass
            setStatus(success ? 'passed' : 'failed');
        }, 3000);
    };

    const statusInfo = {
        idle: { color: 'gray', text: 'Awaiting Test Run', icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        running: { color: 'blue', text: 'Tests in Progress...', icon: 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.182-3.182m0 0h-4.992' },
        passed: { color: 'green', text: 'All Checks Passed', icon: 'M9 12.75L11.25 15 15 9.75' },
        failed: { color: 'red', text: 'Deployment Blocked', icon: 'M6 18L18 6M6 6l12 12' },
    };

    const currentStatus = statusInfo[status];

    return (
        <div>
            <p className="text-[var(--color-text-secondary)] text-sm">
                Before deployment, the agent's new version must pass an automated evaluation against the Golden Dataset.
                If any metric drops below the established threshold, the deployment is automatically blocked.
            </p>
            <div className="my-6 grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                <div className="bg-black/30 p-3 rounded-lg"><strong className="block text-[var(--color-text-accent)]">Alignment Score</strong> &ge; 8.0</div>
                <div className="bg-black/30 p-3 rounded-lg"><strong className="block text-[var(--color-text-accent)]">Tool Robustness</strong> &le; 5% Failover</div>
                <div className="bg-black/30 p-3 rounded-lg"><strong className="block text-[var(--color-text-accent)]">Latency Budget</strong> &le; 2.5s</div>
                <div className="bg-black/30 p-3 rounded-lg"><strong className="block text-[var(--color-text-accent)]">Memory Test</strong> Pass</div>
            </div>
            <div className="flex items-center justify-between mt-4">
                <button
                    onClick={handleRunTest}
                    disabled={status === 'running'}
                    className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                >
                    <Icon path="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-5 h-5" />
                    {status === 'running' ? 'Running...' : 'Run Quality Gate'}
                </button>
                 <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border bg-${currentStatus.color}-500/10 text-${currentStatus.color}-300 border-${currentStatus.color}-500/30`}>
                    <Icon path={currentStatus.icon} className={`w-5 h-5 ${status === 'running' ? 'animate-spin' : ''}`} />
                    {currentStatus.text}
                </div>
            </div>
        </div>
    );
};

const ShadowDeployment: React.FC = () => {
    return (
        <div>
            <p className="text-[var(--color-text-secondary)] text-sm mb-6">
                The new agent version is deployed to a staging environment, receiving 2% of live traffic.
                Its output is discarded, but its performance metrics are monitored against the stable version for 24 hours to ensure no regressions before a full rollout.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Stable Version */}
                <div className="bg-black/30 rounded-lg p-4 border border-green-500/50">
                    <h4 className="font-bold text-lg text-green-300">agent-v1-prod (Live)</h4>
                    <p className="text-xs text-gray-400">Receiving 98% of traffic</p>
                    <div className="mt-4 space-y-2 text-sm">
                        <p><strong>Compliance Score (P50):</strong> 9.2 / 10</p>
                        <p><strong>Tool Failover Rate:</strong> 1.1%</p>
                    </div>
                </div>
                {/* Shadow Version */}
                <div className="bg-black/30 rounded-lg p-4 border border-yellow-500/50 animate-pulse">
                    <h4 className="font-bold text-lg text-yellow-300">agent-v2-shadow (Testing)</h4>
                    <p className="text-xs text-gray-400">Receiving 2% of traffic</p>
                    <div className="mt-4 space-y-2 text-sm">
                        <p><strong>Compliance Score (P50):</strong> 9.4 / 10</p>
                        <p><strong>Tool Failover Rate:</strong> 1.3%</p>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h4 className="font-semibold text-center text-lg text-[var(--color-text-secondary)]">Go / No-Go Decision</h4>
                <div className="flex justify-center gap-4 mt-4">
                    <button className="px-6 py-2 rounded-lg bg-red-700/80 hover:bg-red-600/80 text-white font-semibold transition-colors flex items-center gap-2">
                        <Icon path="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" className="w-5 h-5" />
                        Reject & Rollback
                    </button>
                    <button className="px-6 py-2 rounded-lg bg-green-600/80 hover:bg-green-500/80 text-white font-bold transition-opacity flex items-center gap-2">
                        <Icon path="M9 12.75L11.25 15 15 9.75" className="w-5 h-5" />
                        Approve & Promote
                    </button>
                </div>
            </div>
        </div>
    );
};

export const CiCdPipeline: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <details className="bg-[var(--color-background-secondary)] border border-[var(--color-border-primary)] rounded-lg mb-8">
        <summary className="p-4 cursor-pointer font-semibold text-[var(--color-text-accent)]">View CI/CD Pipeline Blueprint</summary>
        <div className="p-4 border-t border-[var(--color-border-primary)]">
           <pre className="text-xs text-[var(--color-text-secondary)] bg-black/50 p-4 rounded-md overflow-x-auto"><code>{CICD_BLUEPRINT}</code></pre>
        </div>
      </details>
      
      <div className="relative">
        <PipelineStage stageNumber={1} title="Build & Package" iconPath="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75">
            <p className="text-[var(--color-text-secondary)]">A new commit to the <code className="bg-black/30 p-1 rounded text-xs">main</code> branch triggers the pipeline. The agent's code, including the model router and tool wrappers, is packaged into a new container image.</p>
        </PipelineStage>

        <PipelineStage stageNumber={2} title="Test (Automated Quality Gate)" iconPath="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
            <QualityGate />
        </PipelineStage>
        
        <div className="flex gap-6">
            <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-background-tertiary)] border-2 border-[var(--color-border-primary)]">
                    <Icon path="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" className="w-6 h-6 text-[var(--color-text-accent)]" />
                </div>
            </div>
             <div className="flex-1 pb-10">
                <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
                    <span className="text-[var(--color-text-secondary)]">Step 3:</span> Deploy (Safe Rollout)
                </h3>
                <div className="mt-4 bg-[var(--color-background-secondary)] border border-[var(--color-border-primary)] rounded-lg p-6">
                    <ShadowDeployment />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};