import React from 'react';
import { Icon } from './Icon';

const EvolutionSection: React.FC<{
  title: string;
  iconPath: string;
  children: React.ReactNode;
}> = ({ title, iconPath, children }) => (
  <div className="bg-[var(--color-background-secondary)] border border-[var(--color-border-primary)] rounded-lg p-6">
    <h3 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-3">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-background-tertiary)] border-2 border-[var(--color-border-primary)]">
        <Icon path={iconPath} className="w-5 h-5 text-[var(--color-text-accent)]" />
      </div>
      {title}
    </h3>
    <div className="mt-4 pl-12 border-l-2 border-[var(--color-border-primary)]/50 ml-5">
        <div className="ml-4">
            {children}
        </div>
    </div>
  </div>
);

const PromptEvolution: React.FC = () => {
    const [isSubmitted, setIsSubmitted] = React.useState(false);

    const handleSubmit = () => {
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 4000); // Reset after 4s
    };

    return (
    <div className="space-y-4">
        <div className="bg-yellow-900/40 border border-yellow-700 p-3 rounded-lg text-sm">
            <p><strong className="text-yellow-300">Trigger:</strong> Inefficient RAG queries detected (multiple redundant calls in Trace ID: 7B-4A1C).</p>
        </div>
        <div>
            <h4 className="font-semibold text-[var(--color-text-secondary)]">Analysis:</h4>
            <p className="text-sm text-[var(--color-text-secondary)]">The agent called 'retrieve_brand_guidelines' twice with vague queries. The prompt should mandate a 'Step-Back' to formulate a precise query first. The engine has proposed a refinement to the Master Prompt.</p>
        </div>
        <div>
            <h4 className="font-semibold text-[var(--color-text-secondary)] mt-4">Proposed Prompt Refinement:</h4>
            <div className="bg-black/50 p-4 rounded-md font-mono text-sm mt-2">
                <p className="text-red-400">- AFTER the Legal Agent approves the request, your next action must be to call `retrieve_brand_guidelines`...</p>
                <p className="text-green-400">+ AFTER the Legal Agent approves, **Step-Back:** Formulate a single, precise query covering all potential brand/safety questions. Then, call `retrieve_brand_guidelines` **only once**.</p>
            </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
            <button
                onClick={handleSubmit}
                disabled={isSubmitted}
                className="px-4 py-2 rounded-lg bg-[var(--gradient-primary)] hover:opacity-90 text-white font-bold transition-all text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Icon path="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" className="w-5 h-5" />
                {isSubmitted ? 'Submitted to Pipeline' : 'Submit for Shadow Deployment'}
            </button>
        </div>
        {isSubmitted && <p className="text-xs text-center text-[var(--color-text-accent)] mt-2 animate-pulse">Change submitted to CI/CD pipeline for automated testing.</p>}
    </div>
    )
};


const AutomatedRag: React.FC = () => (
     <div className="space-y-4">
        <div className="bg-red-900/40 border border-red-700 p-3 rounded-lg text-sm">
            <p><strong className="text-red-300">Trigger:</strong> User request for "a poster with our logo in a graffiti style" received a compliance score of <strong className="font-bold">2/10</strong>.</p>
        </div>
        <div>
            <h4 className="font-semibold text-[var(--color-text-secondary)]">Analysis:</h4>
            <p className="text-sm text-[var(--color-text-secondary)]">The A-RAG system detected that the existing Brand Guidelines do not explicitly prohibit altering the logo with a 'graffiti' style, creating a compliance gap. An automated draft has been generated to address this.</p>
        </div>
        <div>
            <h4 className="font-semibold text-[var(--color-text-secondary)] mt-4">New Guideline Draft (Pending Human Review):</h4>
            <div className="bg-black/50 p-4 rounded-md text-sm mt-2 border-l-4 border-[var(--color-text-accent)]">
                <p className="text-[var(--color-text-secondary)]">
                    <strong>Logo Usage:</strong> The company logo is a registered trademark and must not be altered, defaced, or presented in styles such as graffiti, grunge, or other forms that detract from its professional appearance and brand integrity. All uses of the logo must adhere to the standard color and spacing guidelines.
                </p>
            </div>
        </div>
        <div className="flex justify-end gap-4 mt-4">
            <button className="px-4 py-2 rounded-lg bg-[var(--color-background-tertiary)] hover:bg-[var(--color-border-primary)] text-[var(--color-text-primary)] font-semibold transition-colors text-sm">
                Reject Draft
            </button>
            <button className="px-4 py-2 rounded-lg bg-green-600/80 hover:bg-green-500/80 text-white font-bold transition-opacity text-sm">
                Approve & Add to RAG
            </button>
        </div>
    </div>
);


export const EvolutionEngine: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
            <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">Continuous Evolution Engine</h2>
            <p className="text-[var(--color-text-secondary)] mt-2 max-w-2xl mx-auto">
               This system uses live production data to automatically identify and fix gaps in the agent's core logic (prompts) and knowledge base (RAG).
            </p>
        </div>

        <EvolutionSection title="Automated Prompt Refinement" iconPath="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.182-3.182m0 0h-4.992">
            <PromptEvolution />
        </EvolutionSection>

        <EvolutionSection title="A-RAG: Automated RAG Gap Analysis" iconPath="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25">
            <AutomatedRag />
        </EvolutionSection>
    </div>
  );
};