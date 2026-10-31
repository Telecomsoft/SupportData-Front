// Fixed lists the pages share. They mirror SDConstants on the server: when a value changes there, change it here.
export type Option = { id: number; name: string }

// SDConstants._USERTYPE_*  (a login has a user type; a personnel record has the same kind of "type")
export const USER_TYPES: Option[] = [
    { id: 1, name: 'کارمند ستاد' },
    { id: 2, name: 'تکنسین میدانی' },
    { id: 3, name: 'تعمیرکار ' },
    { id: 4, name: 'پیمانکار' },
    { id: 5, name: 'مشتری' },
]
export const PERSONNEL_TYPES: Option[] = USER_TYPES.map((t) => (t.id === 5 ? { id: 5, name: 'نماینده مشتری' } : t))

// SDConstants._TASKTYPE_*  (2003, 2005, 2006 exist in the old data: add them here once their names are confirmed)
export const TASK_TYPES: Option[] = [
    { id: 1001, name: 'نصب' },
    { id: 1002, name: 'خرابی' },
    { id: 1003, name: 'بازدید' },
    { id: 2002, name: 'خرابی و بازدید' },
]

// SDConstants._WARRANTYSTART_*
export const WARRANTY_START_MODES: Option[] = [
    { id: 1, name: 'تاریخ نصب' },
    { id: 2, name: 'تاریخ ارسال' },
    { id: 3, name: 'تاریخ فروش' },
    { id: 4, name: 'تاریخ قرارداد' },
    { id: 5, name: 'تاریخ شروع گارانتی خود کیوسک' },
]

// SDConstants._VISITSTART_*
export const VISIT_START_MODES: Option[] = [
    { id: 1, name: 'از تاریخ نصب' },
    { id: 2, name: 'از یک تاریخ مشخص' },
]

export const nameOf = (list: Option[], id?: number | null) => list.find((o) => o.id === id)?.name ?? ''

// ─── Work tasks (SDConstants._TASKSTATE_*, _WORKMODE_*, _TASKLOG_*) ─────────────────────────────
export const TASK_STATE = { NEW: 1, ASSIGNED: 2, CANCELLED: 3, IN_PROGRESS: 4, WAITING_PARTS: 5, FINISHED: 7, APPROVED: 8 } as const

export const TASK_STATES: Option[] = [
    { id: 1, name: 'جدید' },
    { id: 2, name: 'ارجاع شده' },
    { id: 4, name: 'در حال انجام' },
    { id: 5, name: 'در انتظار قطعه' },
    { id: 7, name: 'اتمام' },
    { id: 8, name: 'تایید نهایی' },
    { id: 3, name: 'انصراف' },
]

export const WORK_MODES: Option[] = [
    { id: 1, name: 'از راه دور' },
    { id: 2, name: 'حضوری' },
]

// the customer's own users may only report a fault (the server refuses anything else)
export const CUSTOMER_TASK_TYPES: Option[] = TASK_TYPES.filter((t) => t.id === 1002)

export const TASK_LOG_KINDS: Option[] = [
    { id: 1, name: 'تغییر وضعیت' },
    { id: 2, name: 'ارجاع' },
    { id: 3, name: 'تصحیح تاریخ' },
    { id: 4, name: 'ویرایش' },
]

export const isTaskClosed = (state?: number | null) => state === 3 || state === 7 || state === 8

type ChipColor = 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
export const TASK_STATE_COLOR: Record<number, ChipColor> = { 1: 'info', 2: 'primary', 3: 'default', 4: 'warning', 5: 'warning', 7: 'success', 8: 'success' }

/**
 * Mirrors WorkTaskWorkflow.Transitions on the server (From, To, operation permission; 0 = none).
 * The server decides for real; this only decides which buttons to show. The move to "assigned" is not here:
 * it needs a technician, so it goes through the "assign" dialog.
 */
export const TASK_TRANSITIONS: { from: number; to: number; permission: number; label: string; confirm: string }[] = [
    { from: 1, to: 3, permission: 204, label: 'انصراف', confirm: 'دستورکار لغو شود؟' },
    { from: 1, to: 7, permission: 205, label: 'اتمام (حل تلفنی)', confirm: 'دستورکار تمام شود؟' },
    { from: 2, to: 4, permission: 0, label: 'شروع کار', confirm: 'کار روی دستورکار شروع شود؟' },
    { from: 2, to: 3, permission: 204, label: 'انصراف', confirm: 'دستورکار لغو شود؟' },
    { from: 2, to: 7, permission: 205, label: 'اتمام', confirm: 'دستورکار تمام شود؟' },
    { from: 4, to: 5, permission: 0, label: 'در انتظار قطعه', confirm: 'دستورکار در انتظار قطعه قرار گیرد؟' },
    { from: 5, to: 4, permission: 0, label: 'ادامه کار', confirm: 'کار دوباره ادامه پیدا کند؟' },
    { from: 4, to: 3, permission: 204, label: 'انصراف', confirm: 'دستورکار لغو شود؟' },
    { from: 4, to: 7, permission: 205, label: 'اتمام', confirm: 'دستورکار تمام شود؟' },
    { from: 7, to: 8, permission: 206, label: 'تایید نهایی', confirm: 'دستورکار تایید نهایی شود؟' },
    { from: 7, to: 4, permission: 206, label: 'بازگشت برای اصلاح', confirm: 'دستورکار برای اصلاح به «در حال انجام» برگردد؟' },
    { from: 8, to: 7, permission: 206, label: 'لغو تایید نهایی', confirm: 'تایید نهایی برداشته شود؟' },
]
