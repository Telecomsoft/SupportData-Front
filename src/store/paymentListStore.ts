// store.ts  
import { create } from 'zustand';

// Define your data type  
type Item = {
    [k: string | number]: any
}

// Define store state and actions  
type StoreState = {
    items: Item[];
    addItem: (item: Item) => void;
    editItem: (id: number, updatedItem: Partial<Item>) => void;
    removeItem: (id?: number | string) => void;
    multiAddItems: (item: Item) => void;
    removeAllItems: () => void;
}

const paymentListStore = create<StoreState>((set) => ({
    items: [],
    addItem: (item) => set((state) => {
        const getIds: any = state.items.map(i => i.id)
        const maxId = Math.max(...getIds)

        return {
            items: [...state.items, { ...item, id: maxId !== -Infinity ? maxId + 1 : 1 }]
        }
    }
    ),
    multiAddItems: (data: any) => set((state) => {
        return { items: [...state.items, ...data] }
    }),
    editItem: (id, updatedItem) =>
        set((state) => ({
            items: state.items.map((item) => {
                return item.id === id ? { ...item, ...updatedItem } : item
            }
            ),
        })),
    removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id),
    })),
    removeAllItems: () => set({ items: [] })
}));

export default paymentListStore;  