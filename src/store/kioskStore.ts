import { create } from 'zustand';

// Define the interface for your store's state
interface KioskState {
  selectedKiosks: string[];  // Array of selected kiosk serials
  toggleKioskSelection: (kioskSerial: string) => void;
  clearSelection: () => void;
}

// Create the store with typed state and actions
const useKioskStore = create<KioskState>((set, get) => ({
  selectedKiosks: [],  // Initial state: no kiosks selected
  
  // Action to toggle the selection of a kiosk
  toggleKioskSelection: (kioskSerial: string) => {
    const { selectedKiosks } = get();
    if (selectedKiosks.includes(kioskSerial)) {
      set({
        selectedKiosks: selectedKiosks.filter((serial) => serial !== kioskSerial),
      });
    } else {
      set({ selectedKiosks: [...selectedKiosks, kioskSerial] });
    }
  },

  // Action to clear all selections
  clearSelection: () => set({ selectedKiosks: [] }),
}));

export default useKioskStore;
