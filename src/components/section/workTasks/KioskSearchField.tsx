/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useEffect, useRef, useState } from 'react'
import { Controller } from 'react-hook-form'
import Grid from '@mui/material/Grid2'
import { Box, Chip, Stack, Typography, useTheme } from '@mui/material'
import StyledTextField from '@components/general/input/StyledTextField'
import { StyledAutoComplete } from '@components/general/input/StyledAutoComplete'
import { usePostData } from '@hooks/usePostData'

/** One kiosk of POST api/WorkTask/SearchKiosks (KioskSearchItem on the server). */
export type KioskSearchItem = {
    id: number
    serial: string
    kioskModelName?: string | null
    customerID?: number | null
    customerName?: string | null
    customerOrganizationName?: string | null
    customerContactName?: string | null
    branchCode?: string | null
    branchName?: string | null
    cityName?: string | null
    provinceName?: string | null
    address?: string | null
    beneficiaryName?: string | null
    terminalID?: string | null
    merchant?: string | null
    fileNo?: string | null
    isActive?: boolean
}

const MAX_RESULTS = 50
const DEBOUNCE_MS = 350

// Persian / Arabic digits -> 0-9: the server does the same before it searches, so the highlight matches
const toLatinDigits = (s: string) =>
    s.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** `text` with every occurrence of `term` marked (case-insensitive, no regex injection). */
const Highlight = ({ text, term }: { text?: string | null; term: string }) => {
    const theme = useTheme()
    if (!text) return null
    if (!term) return <>{text}</>
    const parts = text.split(new RegExp(`(${escapeRegExp(term)})`, 'gi'))
    const bg = (theme.palette as any).yellow?.[1] ?? '#ffe08a'
    return (
        <>
            {parts.map((part, i) =>
                part.toLowerCase() === term.toLowerCase()
                    ? <mark key={i} style={{ backgroundColor: bg, color: 'inherit', borderRadius: 2, padding: '0 1px' }}>{part}</mark>
                    : <Fragment key={i}>{part}</Fragment>
            )}
        </>
    )
}

const Field = ({ label, value, term, ltr, wide }: { label: string; value?: string | null; term: string; ltr?: boolean; wide?: boolean }) =>
    value ? (
        <Box sx={{ minWidth: 0, ...(wide && { gridColumn: '1 / -1' }) }}>
            <Typography variant="caption" color="text.secondary" component="div" sx={{ lineHeight: 1.3, textAlign: 'start' }}>{label}</Typography>
            <Typography variant="body2" component="div" sx={{ textAlign: 'start', wordBreak: 'break-word' }}>
                {ltr ? <bdi dir="ltr"><Highlight text={value} term={term} /></bdi> : <Highlight text={value} term={term} />}
            </Typography>
        </Box>
    ) : null

/** The whole kiosk in one card; the searched text is highlighted wherever it appears. Empty fields take no space. */
export const KioskCard = ({ kiosk, term = '' }: { kiosk: KioskSearchItem; term?: string }) => (
    <Box sx={{ width: '100%', py: 0.5, textAlign: 'start' }} dir="rtl">
        <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap" sx={{ mb: 1 }}>
            <Typography variant="subtitle1" fontWeight={700} component="div"><bdi dir="ltr"><Highlight text={kiosk.serial} term={term} /></bdi></Typography>
            {kiosk.kioskModelName && <Chip size="small" variant="outlined" label={<Highlight text={kiosk.kioskModelName} term={term} />} />}
            {kiosk.isActive === false && <Chip size="small" color="warning" label="غیرفعال" />}
        </Stack>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', columnGap: 2, rowGap: 1.25 }}>
            <Field label="مشتری" value={kiosk.customerName} term={term} />
            <Field label="سازمان" value={kiosk.customerOrganizationName} term={term} />
            <Field label="نام مرتبط" value={kiosk.customerContactName} term={term} />
            <Field label="کد شعبه" value={kiosk.branchCode} term={term} ltr />
            <Field label="نام شعبه" value={kiosk.branchName} term={term} />
            <Field label="شهر محل نصب" value={kiosk.cityName} term={term} />
            <Field label="استان" value={kiosk.provinceName} term={term} />
            <Field label="ذی‌نفع" value={kiosk.beneficiaryName} term={term} />
            <Field label="شماره ترمینال" value={kiosk.terminalID} term={term} ltr />
            <Field label="پذیرنده" value={kiosk.merchant} term={term} ltr />
            <Field label="شماره پرونده" value={kiosk.fileNo} term={term} ltr />
            <Field label="آدرس" value={kiosk.address} term={term} wide />
        </Box>
    </Box>
)

/**
 * The kiosk picker of the "new task" dialog (a GeneralDialog item: kind 'custom').
 * The person types anything (serial, branch code or name, city, customer...); the text goes to the server, which
 * returns at most 50 kiosks that contain it anywhere. Every result is a card, with the typed text highlighted.
 * The form value is the chosen kiosk object (or null).
 */
const KioskSearchField = ({ value, label, control, size = 12, helperText, validators, disabled, placeholder }: any) => {
    const search = usePostData<{ text: string; number: number }, any>('api/WorkTask/SearchKiosks', 'search-kiosks')
    const [inputValue, setInputValue] = useState('')
    const [options, setOptions] = useState<KioskSearchItem[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)
    const [failed, setFailed] = useState(false)
    const reqId = useRef(0)
    const term = toLatinDigits(inputValue.trim())

    // the search runs once the typing stops; only the newest request may fill the list
    const searchRef = useRef(search)
    searchRef.current = search
    useEffect(() => {
        if (!term) { reqId.current++; setOptions([]); setTotal(0); setLoading(false); setFailed(false); return }
        const id = ++reqId.current
        setLoading(true)
        const timer = setTimeout(() => {
            searchRef.current.mutateAsync({ text: term, number: MAX_RESULTS })
                .then((res: any) => {
                    if (id !== reqId.current) return
                    if (res?.error === 0) { setOptions(res.value?.items ?? []); setTotal(res.value?.total ?? 0); setFailed(false) }
                    else { setOptions([]); setTotal(0); setFailed(true) }
                })
                .catch(() => { if (id === reqId.current) { setOptions([]); setTotal(0); setFailed(true) } })
                .finally(() => { if (id === reqId.current) setLoading(false) })
        }, DEBOUNCE_MS)
        return () => clearTimeout(timer)
    }, [term])

    const Auto = StyledAutoComplete as any

    return (
        <Grid container size={size}>
            <Controller
                name={value}
                control={control}
                rules={validators}
                render={({ field: { onChange, value: selected }, fieldState: { error } }) => (
                    <Box sx={{ width: '100%' }}>
                        <Auto
                            disabled={disabled}
                            options={options}
                            value={selected ?? null}
                            inputValue={inputValue}
                            loading={loading}
                            loadingText="در حال جستجو..."
                            noOptionsText={term ? (failed ? 'خطا در جستجو' : 'موردی پیدا نشد') : 'سریال، کد یا نام شعبه، شهر، مشتری و ... را بنویسید'}
                            filterOptions={(x: KioskSearchItem[]) => x}                      // the server already filtered
                            getOptionLabel={(o: KioskSearchItem) => o?.serial ?? ''}
                            isOptionEqualToValue={(a: KioskSearchItem, b: KioskSearchItem) => a.id === b.id}
                            onInputChange={(_: unknown, text: string, reason: string) => {
                                // 'reset' = the text of a picked option, not a new search
                                if (reason === 'reset') return
                                setInputValue(text)
                            }}
                            onChange={(_: unknown, newValue: KioskSearchItem | null) => {
                                onChange(newValue)
                                setInputValue(newValue?.serial ?? '')
                            }}
                            slotProps={{
                                paper: { sx: { minWidth: { sm: 560 } } },
                                listbox: { sx: { maxHeight: 420 } },
                            }}
                            renderOption={(props: any, option: KioskSearchItem) => {
                                const { key, ...rest } = props
                                return (
                                    <Box component="li" key={key} {...rest} sx={{ borderBottom: '1px solid', borderColor: 'divider', alignItems: 'stretch !important' }}>
                                        <KioskCard kiosk={option} term={term} />
                                    </Box>
                                )
                            }}
                            renderInput={(params: any) => (
                                <StyledTextField
                                    {...params}
                                    label={label}
                                    placeholder={placeholder ?? 'سریال، شعبه، شهر، مشتری...'}
                                    error={!!error}
                                    helperText={
                                        error ? error.message
                                            : total > options.length ? `${options.length} مورد از ${total} مورد نمایش داده شده؛ عبارت جستجو را دقیق‌تر کنید`
                                                : helperText
                                    }
                                    InputLabelProps={{ shrink: !!selected || !!inputValue || undefined }}
                                />
                            )}
                        />

                    </Box>
                )}
            />
        </Grid>
    )
}

export default KioskSearchField
