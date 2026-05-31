import { create } from 'zustand'

const updateRowStore = create<any>((set) => ({
    row: {},

    setRow: (data: any) => {
        set({ row: data })
    },
}))

export default updateRowStore
