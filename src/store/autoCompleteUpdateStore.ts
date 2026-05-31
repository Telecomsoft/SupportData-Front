import { create } from 'zustand'
export type ListUpdateItemsType = {
    id: number
    name: string
    value?: string
    buttonSend: string
    buttonReceive: string
    activeSend: boolean
    activeReceive: boolean
}
interface autoCompleteOptions {
    selectedItemUpdate: ListUpdateItemsType | null
    setSelectedItemUpdate: (item: ListUpdateItemsType | null) => void
}

const useSelectedItemUpdate = create<autoCompleteOptions>((set) => ({
    selectedItemUpdate: null,
    setSelectedItemUpdate: (item) => {
        set({ selectedItemUpdate: item })
    },
}))

export default useSelectedItemUpdate
