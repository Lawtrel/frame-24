import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FiltersState {
    selectedCity: string | null;
    selectedComplexId: string | null;
    selectedDate: Date | null;
    setCity: (city: string | null) => void;
    setComplex: (complexId: string | null) => void;
    setDate: (date: Date | null) => void;
    clearFilters: () => void;
}

export const useFilters = create<FiltersState>()(
    persist(
        (set) => ({
            selectedCity: null,
            selectedComplexId: null,
            selectedDate: null,
            setCity: (city) => set({ selectedCity: city }),
            setComplex: (complexId) => set({ selectedComplexId: complexId }),
            setDate: (date) => set({ selectedDate: date }),
            clearFilters: () =>
                set({
                    selectedCity: null,
                    selectedComplexId: null,
                    selectedDate: null,
                }),
        }),
        {
            name: 'filters-storage',
        }
    )
);
