import { create } from 'zustand';

const useSuccessStore = create((set) => ({
    toasts: [],

    notify: (label, message) => set((state) => ({
        toasts: [...state.toasts, { id: `${Date.now()}-${Math.random()}`, label, message }].slice(-5),
    })),

    dismiss: (id) => set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export default useSuccessStore;
