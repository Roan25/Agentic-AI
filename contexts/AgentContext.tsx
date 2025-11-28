import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { A2UIPayload, A2AStatus } from '../types';

interface AgentState {
  history: A2UIPayload[];
  activeComponent: A2UIPayload | null;
  a2aMonitor: A2AStatus[];
}

type AgentAction =
  | { type: 'ADD_MESSAGE'; payload: A2UIPayload }
  | { type: 'SET_ACTIVE_COMPONENT'; payload: A2UIPayload | null }
  | { type: 'UPDATE_A2A_MONITOR'; payload: A2AStatus[] }
  | { type: 'CLEAR_HISTORY' };

const initialState: AgentState = {
  history: [],
  activeComponent: null,
  a2aMonitor: [],
};

const agentReducer = (state: AgentState, action: AgentAction): AgentState => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      // Also update A2A monitor if the message contains status updates
      const newMonitor = action.payload.a2a_status 
        ? action.payload.a2a_status 
        : state.a2aMonitor;
        
      return {
        ...state,
        history: [...state.history, action.payload],
        a2aMonitor: newMonitor,
        // If it's an interactive card, set it as active
        activeComponent: ['SelectionCard', 'PermissionToggle'].includes(action.payload.component_type) 
          ? action.payload 
          : state.activeComponent
      };
    case 'SET_ACTIVE_COMPONENT':
      return { ...state, activeComponent: action.payload };
    case 'UPDATE_A2A_MONITOR':
      return { ...state, a2aMonitor: action.payload };
    case 'CLEAR_HISTORY':
      return initialState;
    default:
      return state;
  }
};

const AgentContext = createContext<{
  state: AgentState;
  addMessage: (payload: A2UIPayload) => void;
  clearHistory: () => void;
  setActiveComponent: (component: A2UIPayload | null) => void;
} | undefined>(undefined);

export const AgentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(agentReducer, initialState);

  const addMessage = useCallback((payload: A2UIPayload) => {
    dispatch({ type: 'ADD_MESSAGE', payload });
  }, []);

  const clearHistory = useCallback(() => {
    dispatch({ type: 'CLEAR_HISTORY' });
  }, []);

  const setActiveComponent = useCallback((component: A2UIPayload | null) => {
    dispatch({ type: 'SET_ACTIVE_COMPONENT', payload: component });
  }, []);

  return (
    <AgentContext.Provider value={{ state, addMessage, clearHistory, setActiveComponent }}>
      {children}
    </AgentContext.Provider>
  );
};

export const useAgentContext = () => {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgentContext must be used within an AgentProvider');
  }
  return context;
};
