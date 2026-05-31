import { create } from 'zustand';

interface EditStoreState {
  permissionToEdit: boolean; // Use lowercase for the boolean type
  setPermissionToEdit: () => void;
  clearPermissionToEdit: () => void;
}

const useEditStore = create<EditStoreState>((set) => ({
  permissionToEdit: false,
  setPermissionToEdit: () => set({ permissionToEdit: true }),
  clearPermissionToEdit: () => set({ permissionToEdit: false }),
}));

export default useEditStore;
