import { create } from 'zustand'

const useReportList = create<any>((set) => ({
    reportsList: [],
    reportSearchField: {},

    setRoportsList: (list: any) => {
        set({ reportsList: list })
    },
    setReportSearchField: (list: any) => {
        set({ reportSearchField: list })
    },
}))

export default useReportList
