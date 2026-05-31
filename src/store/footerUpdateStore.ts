import { create } from 'zustand'

interface KioskState {
    kioskPathDetails: any,
    kioskServerData: any,
    setData: (item: any, payload: string) => void
}

const useFooterUpdate = create<KioskState>((set) => ({
    kioskPathDetails: null,
    kioskServerData: null,
    setData: (item, payload) => {
        set({ [payload]: item })
    },
}))

export default useFooterUpdate
