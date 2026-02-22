import { create } from 'zustand';

interface ModeState {
    mode: 'normal' | 'banding';
    setMode: (mode: 'normal' | 'banding') => void;
}

export const useModeStore = create<ModeState>((set) => ({
    mode: 'normal',
    setMode: (mode) => set({ mode }),
}));
