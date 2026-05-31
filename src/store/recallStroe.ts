import { create } from 'zustand'

const useRecallStore = create<any>((set) => ({
    recallAction: false,

    setRecall: (data: any) => {
        set({ recallAction: data })
    },
}))

export default useRecallStore
