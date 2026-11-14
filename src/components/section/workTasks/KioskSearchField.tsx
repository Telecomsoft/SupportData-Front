/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, Fragment, HTMLAttributes, ReactNode, useContext, useEffect, useRef, useState } from 'react'
import { Controller } from 'react-hook-form'
import Grid from '@mui/material/Grid2'
import { alpha, Box, Chip, CircularProgress, InputAdornment, Paper, Stack, Typography, useTheme } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
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
    return (
        <>
            {parts.map((part, i) =>
                part.toLowerCase() === term.toLowerCase()
                    ? <mark key={i} style={{ backgroundColor: alpha(theme.palette.secondary.main, 0.4), color: 'inherit', borderRadius: 3, padding: '0 1px' }}>{part}</mark>
                    : <Fragment key={i}>{part}</Fragment>
            )}
        </>
    )
}

/** One icon + text fact of the second line; nothing when there's no text. */
const Meta = ({ icon, children, show = true }: { icon: ReactNode; children: ReactNode; show?: boolean }) =>
    show ? (
        <Stack direction="row" alignItems="center" gap={0.5} sx={{ minWidth: 0, color: 'text.secondary', '& svg': { fontSize: 16, flexShrink: 0, opacity: 0.8 } }}>
            {icon}
            <Typography variant="body2" component="span" noWrap sx={{ color: 'text.secondary' }}>{children}</Typography>
        </Stack>
    ) : null

/** "شعبه 2 · کد 291" (either half may be missing). */
const BranchText = ({ kiosk, term }: { kiosk: KioskSearchItem; term: string }) => (
    <>
        {kiosk.branchName && <Highlight text={kiosk.branchName} term={term} />}
        {kiosk.branchName && kiosk.branchCode && <Box component="span" sx={{ mx: 0.5, opacity: 0.5 }}>·</Box>}
        {kiosk.branchCode && <>کد <bdi dir="ltr"><Highlight text={kiosk.branchCode} term={term} /></bdi></>}
    </>
)

/**
 * A kiosk in two lines: serial (the thing being picked) with its model and customer, then branch, city and contact.
 * No per-field labels: the icons say what each fact is, so the list scans quickly. The searched text is highlighted.
 */
export const KioskCard = ({ kiosk, term = '' }: { kiosk: KioskSearchItem; term?: string }) => (
    <Box sx={{ width: '100%', minWidth: 0, textAlign: 'start' }}>
        <Stack direction="row" alignItems="center" gap={1} sx={{ minWidth: 0 }}>
            <Typography component="bdi" dir="ltr" sx={{ fontFamily: 'yekanBold', fontSize: '0.95rem', letterSpacing: 0.3, whiteSpace: 'nowrap' }}>
                <Highlight text={kiosk.serial} term={term} />
            </Typography>
            {kiosk.kioskModelName && (
                <Chip size="small" variant="outlined" label={<Highlight text={kiosk.kioskModelName} term={term} />}
                    sx={{ height: 20, fontSize: '0.7rem', borderRadius: 1, '& .MuiChip-label': { px: 0.75 } }} />
            )}
            {kiosk.isActive === false && <Chip size="small" color="warning" label="غیرفعال" sx={{ height: 20, fontSize: '0.7rem' }} />}
            {kiosk.customerName && (
                <Typography variant="body2" noWrap sx={{ marginInlineStart: 'auto', minWidth: 0, color: 'primary.main', fontFamily: 'yekanMedium' }}>
                    <Highlight text={kiosk.customerName} term={term} />
                </Typography>
            )}
        </Stack>
        <Stack direction="row" alignItems="center" columnGap={2} rowGap={0.25} flexWrap="wrap" sx={{ mt: 0.5, minWidth: 0 }}>
            <Meta icon={<StorefrontOutlinedIcon />} show={!!(kiosk.branchName || kiosk.branchCode)}><BranchText kiosk={kiosk} term={term} /></Meta>
            <Meta icon={<PlaceOutlinedIcon />} show={!!kiosk.cityName}><Highlight text={kiosk.cityName} term={term} /></Meta>
            <Meta icon={<PersonOutlineIcon />} show={!!kiosk.customerContactName}><Highlight text={kiosk.customerContactName} term={term} /></Meta>
        </Stack>
    </Box>
)

/** Shown under the field once a kiosk is picked, so the person can confirm it's the right one before saving. */
const SelectedKiosk = ({ kiosk }: { kiosk: KioskSearchItem }) => (
    <Stack direction="row" alignItems="flex-start" gap={1}
        sx={(t) => ({ mt: 1, px: 1.5, py: 1, borderRadius: 2, border: '1px solid', borderColor: alpha(t.palette.primary.main, 0.25), bgcolor: alpha(t.palette.primary.main, 0.04) })}>
        <CheckCircleIcon sx={{ color: 'primary.main', fontSize: 20, mt: 0.25 }} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
            <KioskCard kiosk={kiosk} />
            {(kiosk.customerOrganizationName || kiosk.address) && (
                <Stack direction="row" columnGap={2} flexWrap="wrap" sx={{ mt: 0.25 }}>
                    <Meta icon={<BusinessOutlinedIcon />} show={!!kiosk.customerOrganizationName}>{kiosk.customerOrganizationName}</Meta>
                    {kiosk.address && <Typography variant="caption" color="text.secondary" sx={{ wordBreak: 'break-word' }}>{kiosk.address}</Typography>}
                </Stack>
            )}
        </Box>
    </Stack>
)

// what the results header of the popup says; a context so the Paper component can stay a stable module-level component
type ResultsInfo = { shown: number; total: number; visible: boolean }
const ResultsInfoContext = createContext<ResultsInfo>({ shown: 0, total: 0, visible: false })

const ResultsPaper = ({ children, ...props }: HTMLAttributes<HTMLElement>) => {
    const { shown, total, visible } = useContext(ResultsInfoContext)
    const more = total > shown
    return (
        <Paper {...props} elevation={8} sx={{ borderRadius: 2, mt: 0.5, overflow: 'hidden', minWidth: { sm: 560 } }}>
            {visible && (
                <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}
                    sx={(t) => ({ px: 2, py: 0.75, bgcolor: t.palette.bgColor?.[1] ?? 'grey.50', borderBottom: '1px solid', borderColor: 'divider' })}>
                    <Typography variant="caption" color="text.secondary">
                        {more ? `${shown} مورد از ${total} مورد` : `${shown} مورد`}
                    </Typography>
                    {more && <Typography variant="caption" sx={{ color: 'warning.dark' }}>برای نتیجه‌ی دقیق‌تر، عبارت بیشتری بنویسید</Typography>}
                </Stack>
            )}
            {children}
        </Paper>
    )
}

/**
 * The kiosk picker of the "new task" dialog (a GeneralDialog item: kind 'custom').
 * The person types anything (serial, branch code or name, city, customer...); the text goes to the server, which
 * returns at most 50 kiosks that contain it anywhere. Every result is a two-line row, with the typed text highlighted.
 * The form value is the chosen kiosk object (or null).
 */
const KioskSearchField = ({ value, label, control, size = 12, helperText, validators, disabled, placeholder }: any) => {
    const search = usePostData<{ text: string; number: number }, any>('api/WorkTask/SearchKiosks', 'search-kiosks')
    const [inputValue, setInputValue] = useState('')
    const [options, setOptions] = useState<KioskSearchItem[]>([])
    const [total, setTotal] = useState(0)
    const [searchedTerm, setSearchedTerm] = useState('')   // the term the current options are for
    const [failed, setFailed] = useState(false)
    const reqId = useRef(0)
    const term = toLatinDigits(inputValue.trim())
    // derived, so there's no frame between typing and the effect where the list says "not found"
    const loading = !!term && term !== searchedTerm

    // the search runs once the typing stops; only the newest request may fill the list
    const searchRef = useRef(search)
    searchRef.current = search
    useEffect(() => {
        if (!term) { reqId.current++; setOptions([]); setTotal(0); setSearchedTerm(''); setFailed(false); return }
        const id = ++reqId.current
        const timer = setTimeout(() => {
            searchRef.current.mutateAsync({ text: term, number: MAX_RESULTS })
                .then((res: any) => {
                    if (id !== reqId.current) return
                    if (res?.error === 0) { setOptions(res.value?.items ?? []); setTotal(res.value?.total ?? 0); setFailed(false) }
                    else { setOptions([]); setTotal(0); setFailed(true) }
                })
                .catch(() => { if (id === reqId.current) { setOptions([]); setTotal(0); setFailed(true) } })
                .finally(() => { if (id === reqId.current) setSearchedTerm(term) })
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
                        <ResultsInfoContext.Provider value={{ shown: options.length, total, visible: !!term && !loading && options.length > 0 }}>
                            <Auto
                                disabled={disabled}
                                options={options}
                                value={selected ?? null}
                                inputValue={inputValue}
                                loading={loading}
                                autoHighlight                                                    // Enter picks the first result
                                forcePopupIcon={false}                                           // a search, not a dropdown to browse
                                loadingText={
                                    <Stack direction="row" alignItems="center" gap={1}>
                                        <CircularProgress size={14} thickness={5} /> در حال جستجو...
                                    </Stack>
                                }
                                noOptionsText={term ? (failed ? 'خطا در جستجو؛ دوباره تلاش کنید' : `کیوسکی با «${term}» پیدا نشد`) : 'سریال، کد یا نام شعبه، شهر، مشتری و ... را بنویسید'}
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
                                PaperComponent={ResultsPaper}
                                slotProps={{
                                    listbox: { sx: { maxHeight: 400, py: 0 } },
                                }}
                                renderOption={(props: any, option: KioskSearchItem) => {
                                    const { key, ...rest } = props
                                    return (
                                        <Box component="li" key={key} {...rest}
                                            sx={(t) => ({
                                                px: '16px !important', py: '10px !important',
                                                borderBottom: '1px solid', borderColor: 'divider',
                                                '&:last-of-type': { borderBottom: 0 },
                                                // the keyboard / hover row: a primary bar on the start edge
                                                '&.Mui-focused': { bgcolor: `${alpha(t.palette.primary.main, 0.05)} !important`, boxShadow: `inset -3px 0 0 ${t.palette.primary.main}` },
                                                '&[aria-selected="true"]': { bgcolor: `${alpha(t.palette.primary.main, 0.09)} !important` },
                                            })}>
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
                                        helperText={error ? error.message : helperText}
                                        InputLabelProps={{ ...params.InputLabelProps, shrink: !!selected || !!inputValue || undefined }}
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ color: 'text.secondary', marginInlineStart: '4px' }}>
                                                    {loading ? <CircularProgress size={18} thickness={5} color="inherit" /> : <SearchIcon fontSize="small" />}
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </ResultsInfoContext.Provider>
                        {selected && <SelectedKiosk kiosk={selected} />}
                    </Box>
                )}
            />
        </Grid>
    )
}

export default KioskSearchField
