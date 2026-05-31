import { create } from 'zustand';


interface CopyStoreState {
  copyData: Record<any, any> | null;
  setCopyKiosk: (data: Record<string, any>) => void; 
  clearCopyData: () => void; 
}


const useCopyStore = create<CopyStoreState>((set) => ({
  copyData: null,  
  
  
  setCopyKiosk: (data) => set({ copyData: data }),


  clearCopyData: () => set({ copyData: null }),
}));

export default useCopyStore;
