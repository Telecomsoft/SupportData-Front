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