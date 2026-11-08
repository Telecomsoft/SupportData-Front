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
    { from: 1, to: 3, permission: 204, label: 'انصراف', confirm: 'فعالیت لغو شود؟' },
    { from: 1, to: 7, permission: 205, label: 'اتمام (حل تلفنی)', confirm: 'فعالیت تمام شود؟' },
    { from: 2, to: 4, permission: 0, label: 'شروع کار', confirm: 'کار روی فعالیت شروع شود؟' },
    { from: 2, to: 3, permission: 204, label: 'انصراف', confirm: 'فعالیت لغو شود؟' },
    { from: 2, to: 7, permission: 205, label: 'اتمام', confirm: 'فعالیت تمام شود؟' },
    { from: 4, to: 5, permission: 0, label: 'در انتظار قطعه', confirm: 'فعالیت در انتظار قطعه قرار گیرد؟' },
    { from: 5, to: 4, permission: 0, label: 'ادامه کار', confirm: 'کار دوباره ادامه پیدا کند؟' },
    { from: 4, to: 3, permission: 204, label: 'انصراف', confirm: 'فعالیت لغو شود؟' },
    { from: 4, to: 7, permission: 205, label: 'اتمام', confirm: 'فعالیت تمام شود؟' },
    { from: 7, to: 8, permission: 206, label: 'تایید نهایی', confirm: 'فعالیت تایید نهایی شود؟' },
    { from: 7, to: 4, permission: 206, label: 'بازگشت برای اصلاح', confirm: 'فعالیت برای اصلاح به «در حال انجام» برگردد؟' },
    { from: 8, to: 7, permission: 206, label: 'لغو تایید نهایی', confirm: 'تایید نهایی برداشته شود؟' },
]


// ─── Repairs (SDConstants._REPAIRSTATE_*) ───────────────────────────────────────────────────────
export const REPAIR_STATE = { RECEIVED: 1, ASSIGNED: 2, IN_REPAIR: 3, REPAIRED: 8, NOT_REPAIRABLE: 9, RETURNED: 10 } as const

// built-in copy of GET api/Repair/Lookups -> states; the page uses the server's list and falls back to this one
export const REPAIR_STATES: Option[] = [
    { id: 1, name: 'دریافت شده' },
    { id: 2, name: 'ارجاع شده' },
    { id: 3, name: 'در حال تعمیر' },
    { id: 8, name: 'تعمیر شد' },
    { id: 9, name: 'غیرقابل تعمیر' },
    { id: 10, name: 'برگشت داده شد' },
]

export const isRepairClosed = (state?: number | null) => state === 8 || state === 9 || state === 10

export const REPAIR_STATE_COLOR: Record<number, ChipColor> = { 1: 'info', 2: 'primary', 3: 'warning', 8: 'success', 9: 'error', 10: 'default' }

/**
 * Mirrors RepairWorkflow.Transitions on the server (From, To, operation permission; 0 = only the module's write access).
 * The server decides for real. The move to "assigned" is not here: it needs a technician, so it goes through the assign dialog.
 */
export const REPAIR_TRANSITIONS: { from: number; to: number; permission: number; label: string; confirm: string }[] = [
    { from: 2, to: 3, permission: 0, label: 'شروع تعمیر', confirm: 'تعمیر قطعه شروع شود؟' },
    { from: 3, to: 8, permission: 241, label: 'تعمیر شد', confirm: 'قطعه تعمیر‌شده ثبت شود؟' },
    { from: 3, to: 9, permission: 241, label: 'غیرقابل تعمیر', confirm: 'قطعه غیرقابل تعمیر ثبت شود؟' },
    { from: 3, to: 10, permission: 241, label: 'برگشت بدون تعمیر', confirm: 'قطعه بدون تعمیر برگردانده شود؟' },
    { from: 1, to: 10, permission: 241, label: 'برگشت بدون تعمیر', confirm: 'قطعه بدون تعمیر برگردانده شود؟' },
    { from: 2, to: 10, permission: 241, label: 'برگشت بدون تعمیر', confirm: 'قطعه بدون تعمیر برگردانده شود؟' },
]


// ─── Part transfers (SDConstants._PARTMOVE_*, _PARTSTATE_*, _PARTLOC_*) ──────────────────────────
export const PART_STATE = { PENDING: 1, DONE: 2, CANCELLED: 3 } as const

// built-in copies of GET api/PartTransfer/Lookups; the pages use the server's lists and fall back to these
export const PART_STATES: Option[] = [
    { id: 1, name: 'در انتظار' },
    { id: 2, name: 'انجام شده' },
    { id: 3, name: 'لغو شده' },
]
export const PART_KINDS: Option[] = [
    { id: 1, name: 'خرید' },
    { id: 2, name: 'تحویل به تکنسین' },
    { id: 3, name: 'بازگشت سالم به انبار' },
    { id: 4, name: 'نصب در کیوسک' },
    { id: 5, name: 'خارج کردن از کیوسک' },
    { id: 6, name: 'ارسال به تعمیرگاه' },
    { id: 7, name: 'بازگشت از تعمیرگاه' },
    { id: 8, name: 'اسقاط از انبار' },
    { id: 9, name: 'اسقاط از تعمیرگاه' },
]
export const PART_LOCATIONS: Option[] = [
    { id: 1, name: 'انبار' },
    { id: 2, name: 'تکنسین' },
    { id: 3, name: 'کیوسک' },
    { id: 4, name: 'تعمیرگاه' },
    { id: 5, name: 'خارج از سیستم' },
]

export const PART_STATE_COLOR: Record<number, ChipColor> = { 1: 'warning', 2: 'success', 3: 'default' }

// Fitting into / taking out of a kiosk (4, 5) is done only by "replace part" on a work task, never as a loose movement.
export const PART_KINDS_CREATABLE = [1, 2, 3, 6, 7, 8, 9]
// movements with a technician on one side: the technician field matters (and a field technician may create only these)
export const PART_KINDS_WITH_TECHNICIAN = [2, 3, 6]
// movements that release or destroy stock need the "Parts - Approve transfer" permission (230) to be completed
export const PART_KINDS_NEED_APPROVAL = [2, 8, 9]


// ─── Statements (SDConstants._STATEMENTSTATE_*) ─────────────────────────────────────────────────
// The statement controller has no Lookups endpoint, so these names are the only copy on the front.
export const STATEMENT_STATE = { NEW: 1, CALCULATED: 2, SENT: 3, APPROVED: 4, SETTLED: 5 } as const

export const STATEMENT_STATES: Option[] = [
    { id: 1, name: 'جدید' },
    { id: 2, name: 'محاسبه شده' },
    { id: 3, name: 'ارسال شده' },
    { id: 4, name: 'تایید شده' },
    { id: 5, name: 'تسویه شده' },
]

export const STATEMENT_STATE_COLOR: Record<number, ChipColor> = { 1: 'info', 2: 'primary', 3: 'warning', 4: 'success', 5: 'default' }

/**
 * Mirrors StatementWorkflow.CanChangeState on the server (From, To, operation permission; 0 = only the module's write access).
 * "New" is never a target (editing resets to New) and "Calculated" is reached by CalculateStatement, so they are not
 * here, except taking a Sent statement back. The server decides for real; this only decides which buttons to show.
 */
export const STATEMENT_TRANSITIONS: { from: number; to: number; permission: number; label: string; confirm: string }[] = [
    { from: 2, to: 3, permission: 0, label: 'ارسال', confirm: 'صورت‌حساب برای پیمانکار ارسال شود؟' },
    { from: 2, to: 4, permission: 250, label: 'تایید', confirm: 'صورت‌حساب تایید شود؟ با تایید، همه‌ی فعالیت های آن قفل می‌شوند و راه برگشتی نیست.' },
    { from: 3, to: 2, permission: 0, label: 'بازگشت به محاسبه‌شده', confirm: 'صورت‌حساب به «محاسبه شده» برگردد؟' },
    { from: 3, to: 4, permission: 250, label: 'تایید', confirm: 'صورت‌حساب تایید شود؟ با تایید، همه‌ی فعالیت های آن قفل می‌شوند و راه برگشتی نیست.' },
    { from: 4, to: 5, permission: 251, label: 'تسویه', confirm: 'صورت‌حساب تسویه شود؟ بعد از تسویه هیچ تغییری ممکن نیست.' },
]
