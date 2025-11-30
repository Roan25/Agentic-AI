import React, { useState } from 'react';
import { Icon } from './Icon';

const TOT_PYTHON_CODE = `
import asyncio
import json
from typing import List, Dict

# --- Configuration ---
# Pre-defined "Creative Angles" to ensure variety without a meta-prompt step
CREATIVE_ANGLES = [
    "High-Energy/Viral (Short, punchy, trending audio)",
    "Cinematic/Premium (Slow motion, high production value)",
    "Authentic/UGC (Handheld style, natural lighting)"
]

async def generate_single_concept(angle: str, user_request: str, guidelines: str) -> Dict:
    """
    Worker function to generate ONE concept. 
    Runs in parallel with others.
    """
    prompt = f"""
    ROLE: Creative Director.
    TASK: Create a video concept for request: '{user_request}'.
    STYLE: {angle}.
    CONSTRAINT: Must align with Brand Guidelines: {guidelines[:200]}...
    OUTPUT: Strict JSON {{ "title": "...", "script": "...", "visuals": "..." }}
    """
    # Use Pro for creativity, but the prompt is short, so it's fast.
    response = await generate_content_async(model="gemini-2.5-pro", contents=prompt)
    
    try:
        concept = json.loads(response.text)
        concept['id'] = angle.split("/")[0] # e.g., "High-Energy"
        return concept
    except:
        return None # Handle parsing errors gracefully

async def tree_of_thoughts_parallel(user_request: str) -> Dict:
    """
    The "Map-Reduce" orchestrator. 
    Reduces Latency from ~15s to ~3s.
    """
    # 1. Fetch Context (Async)
    guidelines_future = retrieve_brand_guidelines_async("visual style")
    
    # 2. Wait for context (Fast due to Redis Cache)
    guidelines = await guidelines_future
    
    # 3. Fan-Out: Launch 3 generation tasks simultaneously
    # This is the key fix. We don't wait for A to finish before starting B.
    tasks = [
        generate_single_concept(angle, user_request, guidelines['content']) 
        for angle in CREATIVE_ANGLES
    ]
    
    # 4. Gather Results
    results = await asyncio.gather(*tasks)
    valid_concepts = [r for r in results if r is not None]

    # 5. Return Payload immediately
    # We skip the 'Judgement' phase here for speed, relying on the 
    # 'Creative Angles' constraints to ensure quality.
    return {
        "component_type": "SelectionCard",
        "component_data": {
            "status": "READY",
            "concepts": valid_concepts
        },
        "internal_metrics": {
            "generation_mode": "parallel_map_reduce",
            "latency_ms": 2100 # Estimated
        }
    }
`;

const INFRA_TERRAFORM_CODE = `resource "google_cloud_run_service" "agent_service" {
  template {
    spec {
      containers {
        # ... your container config ...
        resources {
          # BOOST CPU limits to handle parallelism
          limits = { cpu = "2000m", memory = "1Gi" }
        }
      }
    }
    metadata {
      annotations = {
        # CRITICAL FIX: Keep CPU running for background threads
        "run.googleapis.com/cpu-throttling" = "false"
      }
    }
  }
}`;

const DOCKERFILE_CODE = `# Dockerfile Optimization for Async Concurrency
FROM python:3.11-slim

WORKDIR /app
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# CRITICAL CONFIGURATION: 
# 1. Use '--threads 8' to allow async IO (asyncio) to handle 
#    multiple outbound requests (ToT Fan-Out) without blocking.
# 2. Keep workers low (1-2) to avoid memory overhead, rely on threads/asyncio.
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 main:app`;

const blueprintData = [
  {
    pillar: 'Cognitive Design',
    choice: 'Hierarchical CoT/ToT',
    implementation: 'Metaprompt (<cognitive_pipeline>)',
    codeSnippet: TOT_PYTHON_CODE,
  },
  {
    pillar: 'Memory',
    choice: 'Implicit Tracking → Confirmed Learning',
    implementation: 'log_implicit_preference & confirm_and_save_profile',
    codeSnippet: `# Memory Protocol
def log_preference(user_id, interaction):
    vector_db.upsert(
        id=f"pref_{uuid()}",
        vector=embed(interaction),
        metadata={"type": "implicit", "timestamp": now()}
    )

def check_for_pattern(user_id):
    # Retrieve last 5 interactions
    history = vector_db.query(user_id, limit=5)
    if detect_repetition(history):
        return trigger_confirmation_ui(pattern=extract_pattern(history))`,
  },
  {
    pillar: 'Efficiency/Routing',
    choice: 'Parallel Execution → Model Router',
    implementation: 'B.E. Model Router (Flash for Judge, Pro for Creation)',
    codeSnippet: `# Model Router Logic
def route_request(task_type):
    if task_type == "creative_generation":
        return "gemini-1.5-pro" # High creativity
    elif task_type == "evaluation" or task_type == "classification":
        return "gemini-1.5-flash" # Low latency, lower cost
    else:
        return "gemini-1.5-flash" # Default`,
  },
  {
    pillar: 'Infrastructure',
    choice: 'Async Background Processing',
    implementation: 'Cloud Run (CPU Always-On) + Gunicorn Threads',
    codeSnippet: DOCKERFILE_CODE,
  },
  {
    pillar: 'Resilience',
    choice: 'Self-Correction → Tool Failover',
    implementation: 'B.E. Resilient Tool Wrapper (<error_handling_protocol>)',
    codeSnippet: `# Resilience Wrapper
@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
def call_tool_safe(tool_name, **kwargs):
    try:
        return tools[tool_name](**kwargs)
    except APIError as e:
        log_error(e)
        raise e # Trigger retry`,
  },
  {
    pillar: 'Governance/QA',
    choice: 'LLM-as-a-Judge & Trajectory Trace',
    implementation: 'Metaprompt (<a2ui_api_contract>)',
    codeSnippet: `# Judge Logic
async def llm_as_judge(content, guidelines):
    prompt = f"""
    Evaluate the following content against these guidelines: {guidelines}
    Content: {content}
    Return a score 1-10 and a reasoning.
    """
    return await generate_content(model="gemini-1.5-flash", prompt=prompt)`,
  },
  {
    pillar: 'Automation/Evolve',
    choice: 'Automated Prompt Refinement & A-RAG',
    implementation: 'CI/CD Script (test_agent_quality.py)',
    codeSnippet: null,
  },
];

export const ArchitectureBlueprint: React.FC = () => {
  const [activeCode, setActiveCode] = useState<string | null>(null);

  return (
    <div className="max-w-5xl mx-auto">
       <div className="bg-[var(--color-background-secondary)] border border-[var(--color-border-primary)] rounded-lg p-6">
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--gradient-primary)]">
                    <Icon path="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" className="w-5 h-5 text-white" />
                </div>
                Agent System Architecture Blueprint
            </h3>
            <p className="text-[var(--color-text-secondary)] text-sm mb-6">
                This table outlines the core design pillars and strategic choices that define the CreativeOps-1 agent. 
                Click <span className="text-[var(--color-text-accent)] font-bold">View Code</span> to inspect the implementation details.
            </p>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-[var(--color-text-secondary)]">
                    <thead className="text-xs text-[var(--color-text-accent)] uppercase bg-[var(--color-background-tertiary)]/50">
                        <tr>
                            <th scope="col" className="px-6 py-3 rounded-tl-lg">Pillar</th>
                            <th scope="col" className="px-6 py-3">Strategic Choice</th>
                            <th scope="col" className="px-6 py-3">Implementation</th>
                            <th scope="col" className="px-6 py-3 rounded-tr-lg">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blueprintData.map((item, index) => (
                            <tr key={index} className="border-b border-[var(--color-border-primary)] hover:bg-[var(--color-background-secondary)]/40 transition-colors">
                                <td className="px-6 py-4 font-semibold text-[var(--color-text-primary)]">{item.pillar}</td>
                                <td className="px-6 py-4">{item.choice}</td>
                                <td className="px-6 py-4 font-mono text-xs">
                                    <span className="bg-black/40 px-2 py-1 rounded border border-white/5">{item.implementation}</span>
                                </td>
                                <td className="px-6 py-4">
                                    {item.codeSnippet ? (
                                        <button 
                                            onClick={() => setActiveCode(item.codeSnippet)}
                                            className="text-[var(--color-text-accent)] hover:text-white font-bold text-xs flex items-center gap-1 hover:underline"
                                        >
                                            <Icon path="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" className="w-4 h-4" />
                                            View Code
                                        </button>
                                    ) : (
                                        <span className="text-gray-600 cursor-not-allowed">N/A</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
       </div>

       {/* Code Modal */}
       {activeCode && (
           <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
            onClick={() => setActiveCode(null)}
           >
               <div className="w-full max-w-3xl bg-[#1e1e1e] border border-[var(--color-border-primary)] rounded-xl shadow-2xl overflow-hidden m-4" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#252526]">
                        <span className="text-sm font-mono text-gray-400">implementation_details.config</span>
                        <button onClick={() => setActiveCode(null)} className="text-gray-400 hover:text-white">
                            <Icon path="M6 18L18 6M6 6l12 12" className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="p-0 overflow-x-auto">
                        <pre className="p-4 text-sm font-mono text-[#d4d4d4] leading-relaxed">
                            <code>{activeCode}</code>
                        </pre>
                    </div>
               </div>
           </div>
       )}
    </div>
  );
};