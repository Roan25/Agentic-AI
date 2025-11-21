import React, { useState, useCallback } from 'react';
import { GOLDEN_DATASET } from '../constants';
import { runAndEvaluateTestCase } from '../services/geminiService';
import { TestCase, TestResult } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

const TestCaseCard: React.FC<{ 
  testCase: TestCase; 
  onRun: (testCase: TestCase) => void;
  isLoading: boolean;
}> = ({ testCase, onRun, isLoading }) => {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 flex flex-col">
      <div className="flex justify-between items-start">
        <div>
          <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
            testCase.type === 'Happy Path' ? 'bg-green-500/20 text-green-300' :
            testCase.type === 'Ambiguity' ? 'bg-yellow-500/20 text-yellow-300' :
            'bg-red-500/20 text-red-300'
          }`}>
            {testCase.type}
          </span>
          <h3 className="text-lg font-bold text-cyan-300 mt-2">{testCase.caseId}: {testCase.scenario}</h3>
        </div>
        <button
          onClick={() => onRun(testCase)}
          disabled={isLoading}
          className="bg-fuchsia-600 hover:bg-fuchsia-700 disabled:bg-fuchsia-900/50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Run Test
        </button>
      </div>
      <div className="mt-4 space-y-2 text-sm">
        <p><strong className="text-gray-400">User Prompt:</strong> <code className="bg-black/30 p-1 rounded text-gray-300">{testCase.userPrompt}</code></p>
        <p><strong className="text-gray-400">Expected Behavior:</strong> <span className="text-gray-300 whitespace-pre-wrap">{testCase.expectedBehavior}</span></p>
      </div>
    </div>
  );
};

const TestResultCard: React.FC<{ result: TestResult }> = ({ result }) => {
  const scoreColor = 
    result.evaluation && result.evaluation.score >= 4 ? 'text-green-400' :
    result.evaluation && result.evaluation.score >= 2 ? 'text-yellow-400' :
    'text-red-400';

  return (
    <div className="bg-gray-900/60 border border-gray-700 rounded-lg p-6 mt-4 animate-fade-in">
      <h4 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
        Evaluation Result for {result.testCase.caseId}
      </h4>

      {result.error && (
        <div className="mt-4 bg-red-900/50 border border-red-700 p-4 rounded-lg">
          <p className="font-bold text-red-300">Test Failed</p>
          <p className="text-red-400 text-sm mt-1">{result.error}</p>
        </div>
      )}

      {result.evaluation && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black/30 p-4 rounded-lg">
            <h5 className="text-sm font-semibold text-gray-400 mb-2">Compliance Score</h5>
            <p className={`text-5xl font-bold ${scoreColor}`}>{result.evaluation.score}/5</p>
            <p className="text-sm text-gray-300 mt-1">{result.evaluation.reasoning}</p>
          </div>
          <div className="md:col-span-2 bg-black/30 p-4 rounded-lg">
             <h5 className="text-sm font-semibold text-gray-400 mb-2">Agent Trajectory</h5>
             <div className="text-xs font-mono text-gray-300 space-y-1">
                {result.trajectory.map((step, i) => <p key={i}>{step}</p>)}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const GoldenDatasetTester: React.FC = () => {
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
  const [loadingTestId, setLoadingTestId] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  const handleRunTest = useCallback(async (testCase: TestCase) => {
    setLoadingTestId(testCase.caseId);
    try {
      const result = await runAndEvaluateTestCase(testCase, setLoadingMessage);
      setTestResults(prev => ({...prev, [testCase.caseId]: result}));
    } catch (error) {
       console.error("Failed to run test case", error);
       const errorMessage = error instanceof Error ? error.message : String(error);
       setTestResults(prev => ({...prev, [testCase.caseId]: {
         testCase,
         trajectory: [],
         finalAction: "Error",
         evaluation: null,
         error: errorMessage,
       }}));
    } finally {
      setLoadingTestId(null);
      setLoadingMessage('');
    }
  }, []);

  return (
    <div className="pb-24">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-200">Agent Evaluation Suite</h2>
        <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
          This dashboard runs a "Golden Dataset" of predefined test cases against the agent.
          It uses an LLM-as-a-Judge to automatically score brand compliance and reasoning.
        </p>
      </div>

      {loadingTestId && (
        <div className="my-6">
          <LoadingSpinner text={loadingMessage || `Running test ${loadingTestId}...`} />
        </div>
      )}

      <div className="space-y-6">
        {GOLDEN_DATASET.map(tc => (
          <div key={tc.caseId}>
            <TestCaseCard 
              testCase={tc} 
              onRun={handleRunTest}
              isLoading={loadingTestId !== null}
            />
            {testResults[tc.caseId] && loadingTestId !== tc.caseId && (
              <TestResultCard result={testResults[tc.caseId]} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
