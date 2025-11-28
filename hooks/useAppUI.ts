import { useState, useCallback } from 'react';
import { type AppView } from '../App';

export const useAppUI = () => {
    const [view, setView] = useState<AppView>('creator');
    const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

    const handleSetView = useCallback((newView: AppView) => {
        setView(newView);
    }, []);

    const handleOpenProfile = useCallback(() => {
        setIsProfileModalOpen(true);
    }, []);

    const handleOpenSettings = useCallback(() => {
        setIsSettingsModalOpen(true);
    }, []);

    const handleCloseAllModals = useCallback(() => {
        setIsProfileModalOpen(false);
        setIsSettingsModalOpen(false);
    }, []);

    return {
        view,
        isProfileModalOpen,
        isSettingsModalOpen,
        handleSetView,
        handleOpenProfile,
        handleOpenSettings,
        handleCloseAllModals,
    };
};