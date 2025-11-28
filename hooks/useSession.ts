import { useState, useCallback } from 'react';
import { MOCK_SESSIONS } from '../constants';
import { CreativeConcept } from '../types';

export const useSession = () => {
    const [sessions, setSessions] = useState(MOCK_SESSIONS);
    const [activeSessionId, setActiveSessionId] = useState(MOCK_SESSIONS[0]?.id || null);
    
    // Memory Protocol State
    const [sessionHistory, setSessionHistory] = useState<CreativeConcept[]>([]);
    const [showMemoryModal, setShowMemoryModal] = useState<boolean>(false);
    const [memoryPattern, setMemoryPattern] = useState<{ style: string } | null>(null);
    const [pendingConcept, setPendingConcept] = useState<CreativeConcept | null>(null);

    const handleResetSession = useCallback(() => {
        setSessionHistory([]);
        // Potentially more reset logic here
    }, []);

    const handleNewSession = useCallback(() => {
        const newSessionId = `session_${Date.now()}`;
        setSessions(prev => [{ id: newSessionId, title: 'New Session', date: 'Today' }, ...prev]);
        setActiveSessionId(newSessionId);
        handleResetSession();
    }, [handleResetSession]);

    const handleOpenSession = useCallback((sessionId: string) => {
        setActiveSessionId(sessionId);
        // In a real app, you would fetch the data for this session.
        // For now, we just reset the local state.
        handleResetSession();
    }, [handleResetSession]);

    const handleDeleteSession = useCallback((sessionId: string) => {
        setSessions(prev => {
            const newSessions = prev.filter(s => s.id !== sessionId);
            if (activeSessionId === sessionId) {
                const newActiveId = newSessions.length > 0 ? newSessions[0].id : null;
                setActiveSessionId(newActiveId);
                handleResetSession();
            }
            return newSessions;
        });
    }, [activeSessionId, handleResetSession]);

    const handleConfirmSaveMemory = useCallback(async (callback: () => Promise<void>) => {
        if (memoryPattern && pendingConcept) {
            console.log("SIMULATING: Saving pattern to permanent profile:", memoryPattern);
            // In a real app, you would call a service here.
        }
        setShowMemoryModal(false);
        await callback();
        setMemoryPattern(null);
        setPendingConcept(null);
    }, [memoryPattern, pendingConcept]);

    const handleDeclineSaveMemory = useCallback(async (callback: () => Promise<void>) => {
        setShowMemoryModal(false);
        await callback();
        setMemoryPattern(null);
        setPendingConcept(null);
    }, [pendingConcept]);
    
    const checkForMemoryPattern = (concept: CreativeConcept) => {
        const updatedHistory = [...sessionHistory, concept];
        setSessionHistory(updatedHistory);

        const styleCounts = updatedHistory.reduce((acc, c) => {
            acc[c.style] = (acc[c.style] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const newPatternStyle = Object.keys(styleCounts).find(style => styleCounts[style] === 3);

        if (newPatternStyle) {
            setMemoryPattern({ style: newPatternStyle });
            setPendingConcept(concept);
            setShowMemoryModal(true);
            return true; // Pattern detected, pause execution
        }
        return false; // No pattern, continue execution
    };

    return {
        sessions,
        activeSessionId,
        sessionHistory,
        showMemoryModal,
        memoryPattern,
        pendingConcept,
        handleNewSession,
        handleOpenSession,
        handleDeleteSession,
        handleConfirmSaveMemory,
        handleDeclineSaveMemory,
        handleResetSession,
        checkForMemoryPattern,
    };
};
