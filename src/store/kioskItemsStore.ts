import { create } from 'zustand'

// Define the interface for your store's state
interface KioskState {
    selectedKiosks: Record<string, any>[]
    toggleKioskSelection: (kioskSerial: Record<string, any>) => void
    clearSelection: () => void
}

// Create the store with typed state and actions
const useKiosItemskStore = create<KioskState>((set, get) => ({
    selectedKiosks: [], // Initial state: no kiosks selected

    // Action to toggle the selection of a kiosk
    toggleKioskSelection: (kiosk: Record<string, any>) => {
        const { selectedKiosks } = get()
        if (selectedKiosks?.map((item: Record<string, any>) => item.kioskSerial)?.includes(kiosk?.kioskSerial)) {
            set({
                selectedKiosks: selectedKiosks?.filter((i: Record<string, any>) => i.kioskSerial !== kiosk.kioskSerial),
            })
        } else
            set({
                selectedKiosks: selectedKiosks.concat(kiosk),
            })
    },

    // Action to clear all selections
    clearSelection: () => set({ selectedKiosks: [] }),
}))

export default useKiosItemskStore
