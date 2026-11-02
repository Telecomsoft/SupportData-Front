/** Money is a whole number of rials; a statement date is a day, not a moment (the time part is always midnight). */
export const rial = (v?: number | null) => `${Number(v ?? 0).toLocaleString('fa-IR')} ریال`
export const num = (v?: number | null) => Number(v ?? 0).toLocaleString('fa-IR')
export const day = (d?: string | null) => (d ? new Date(d).toLocaleDateString('fa-IR') : '-')
