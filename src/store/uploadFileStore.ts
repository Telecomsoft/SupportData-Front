import { create } from 'zustand'

interface autoCompleteOptions {
    selectUpload: any
    setSelectUpload: (item: any) => void
}

const uploadFileStore = create<autoCompleteOptions>((set) => ({
    selectUpload: null,
    setSelectUpload: (item) => {
        set({ selectUpload: item })
    },
}))

export default uploadFileStore
