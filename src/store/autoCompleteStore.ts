import { ServiceType } from '@components/general/SettingsChecked'
import { create } from 'zustand'

interface autoCompleteOptions {
    selectedItem: ServiceType | null
    setSelectedItem: (item: ServiceType | null) => void
}

const useSelectedItem = create<autoCompleteOptions>((set) => ({
    selectedItem: null,
    setSelectedItem: (item) => {
        set({ selectedItem: item })
    },
}))

export default useSelectedItem
