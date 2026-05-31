import { create } from 'zustand'

const updateRowCancelStore = create<any>((set) => ({
    rowCancel: {},

    setRowCancel: (data: any) => {
        set({ rowCancel: data })
    },
}))

export default updateRowCancelStore
