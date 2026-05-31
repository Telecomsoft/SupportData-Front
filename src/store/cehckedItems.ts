import { create } from 'zustand'

interface KioskState {
    selectedCheck: string[]
    toggleSelectedCheck: (checkedItem: string) => void
    clearAllChecked: () => void
    fillAllChecked: (allChekced: string[]) => void
}

const useCehckedItems = create<KioskState>((set, get) => ({
    selectedCheck: [],

    toggleSelectedCheck: (checkedItem: string) => {
        const { selectedCheck } = get()
        if (selectedCheck.includes(checkedItem)) {
            set({
                selectedCheck: selectedCheck.filter((check) => check !== checkedItem),
            })
        } else {
            set({ selectedCheck: [...selectedCheck, checkedItem] })
        }
    },
    clearAllChecked: () => set({ selectedCheck: [] }),
    fillAllChecked: (allChekced: string[]) => set({ selectedCheck: [allChekced][0] }),
}))

export default useCehckedItems
