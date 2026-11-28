export type WorkTaskDeskLane = 'all' | 'overdue' | 'unassigned' | 'approval'
export type WorkTaskDeskDensity = 'compact' | 'comfortable'
export type WorkTaskDeskSortMode = 'deadline' | 'newest' | 'state'
export type WorkTaskDeskSearch = {
    lane: WorkTaskDeskLane
    q: string
    status?: number
    type?: number
    customer?: number
    assignee?: number
    branch: string
    from: string
    to: string
    sort: WorkTaskDeskSortMode
    density: WorkTaskDeskDensity
    page: number
}

const asText = (value: unknown) => typeof value === 'string' ? value : ''
const asNumber = (value: unknown) => {
    const parsed = Number(value)
    return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined
}

export const parseWorkTaskDeskSearch = (search: Record<string, unknown>): WorkTaskDeskSearch => ({
    lane: search.lane === 'overdue' || search.lane === 'unassigned' || search.lane === 'approval' ? search.lane : 'all',
    q: asText(search.q),
    status: asNumber(search.status),
    type: asNumber(search.type),
    customer: asNumber(search.customer),
    assignee: asNumber(search.assignee),
    branch: asText(search.branch),
    from: asText(search.from),
    to: asText(search.to),
    sort: search.sort === 'newest' || search.sort === 'state' ? search.sort : 'deadline',
    density: search.density === 'comfortable' ? 'comfortable' : 'compact',
    page: Math.max(1, asNumber(search.page) ?? 1),
})

export const WORK_TASK_DESK_TEXT = {
    title: 'میز کار دستورکارها',
    subtitle: 'پیگیری و مدیریت روزانهٔ تعمیر و نگهداری کیوسک‌ها',
    advancedList: 'فهرست و جستجوی پیشرفته',
    refresh: 'به‌روزرسانی',
    refreshedAt: 'آخرین به‌روزرسانی',
    autoRefresh: 'به‌روزرسانی خودکار هر دقیقه',
    totalActionable: 'کل نیازمند اقدام',
    totalHint: 'فعالیت‌های باز و آمادهٔ تأیید',
    overdue: 'دارای دیرکرد',
    overdueHint: 'نیازمند پیگیری فوری',
    unassigned: 'بدون مسئول',
    unassignedHint: 'نیازمند ارجاع',
    readyApproval: 'آمادهٔ تأیید',
    readyApprovalHint: 'اتمام کار، در انتظار تأیید نهایی',
    allQueue: 'همهٔ موارد نیازمند اقدام',
    overdueQueue: 'موارد دارای دیرکرد',
    unassignedQueue: 'موارد بدون مسئول',
    approvalQueue: 'آمادهٔ تأیید نهایی',
    search: 'شماره، کد کیوسک یا شرح',
    location: 'نام یا کد شعبه',
    filterForm: 'فیلترهای دستورکار',
    status: 'وضعیت',
    type: 'نوع کار',
    customer: 'بانک / مشتری',
    assignee: 'مسئول',
    reportedFrom: 'گزارش از',
    reportedTo: 'گزارش تا',
    sort: 'ترتیب همین صفحه',
    sortDeadline: 'نزدیک‌ترین مهلت',
    sortNewest: 'جدیدترین گزارش',
    sortState: 'وضعیت',
    density: 'تراکم',
    compact: 'فشرده',
    comfortable: 'راحت',
    clearFilters: 'پاک کردن فیلترها',
    allStatuses: 'همهٔ وضعیت‌ها',
    allTypes: 'همهٔ انواع',
    allCustomers: 'همهٔ بانک‌ها / مشتریان',
    allAssignees: 'همهٔ مسئولان',
    results: 'نتیجه',
    selectPage: 'انتخاب همهٔ موارد این صفحه',
    selectTask: 'انتخاب دستورکار',
    selected: 'مورد انتخاب شده',
    emptyTitle: 'موردی در این صف نیست',
    emptyDescription: 'فیلترها را تغییر دهید یا صف دیگری را انتخاب کنید.',
    listError: 'دریافت دستورکارها انجام نشد.',
    retry: 'تلاش دوباره',
    previousPage: 'صفحهٔ قبل',
    nextPage: 'صفحهٔ بعد',
    page: 'صفحه',
    showing: 'نمایش',
    of: 'از',
    fullManagement: 'مدیریت کامل و فیلترهای بیشتر',
    noDescription: 'بدون شرح',
    noAssignee: 'بدون مسئول',
    assign: 'ارجاع',
    kiosk: 'کیوسک',
    branch: 'شعبه',
    reported: 'تاریخ گزارش',
    deadline: 'مهلت',
    daysLeft: 'روز مانده',
    daysOverdue: 'روز تأخیر',
    today: 'امروز',
    overdueToday: 'موعد امروز گذشته',
    viewDetails: 'مشاهدهٔ جزئیات',
    moreActions: 'عملیات بیشتر',
    print: 'چاپ فرم',
    taskLabel: (id: string, state: string, kiosk: string) => `دستورکار ${id}؛ ${state}؛ ${kiosk}`,
} as const

export const WORK_TASK_DESK_SORT_OPTIONS = [
    { value: 'deadline', label: WORK_TASK_DESK_TEXT.sortDeadline },
    { value: 'newest', label: WORK_TASK_DESK_TEXT.sortNewest },
    { value: 'state', label: WORK_TASK_DESK_TEXT.sortState },
] as const
