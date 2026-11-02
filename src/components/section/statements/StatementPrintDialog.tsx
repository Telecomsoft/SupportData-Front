/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from 'react'
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useGetData } from '@hooks/useGetData'
import CustomCircularProgress from '@components/general/CustomCircularProgress'
import { day, num, rial } from '@components/section/statements/statementFormat'

// one stylesheet for the preview and for the print window (the preview's HTML is copied into the print window as is)
const PRINT_CSS = `
.st-print{direction:rtl;font-family:Tahoma,Vazirmatn,sans-serif;color:#000;font-size:12px}
.st-print h2{text-align:center;margin:0 0 8px}
.st-print .box{border:1px solid #888;padding:6px 8px;margin-bottom:8px}
.st-print table{border-collapse:collapse;width:100%;margin-bottom:8px}
.st-print th,.st-print td{border:1px solid #888;padding:3px 5px;text-align:center}
.st-print th{background:#eee}
.st-print .sum td{font-weight:bold}
.st-print .total{font-size:14px;font-weight:bold;text-align:left}
`

/**
 * The printed statement (GET api/Statement/PrintStatement/{id}): the server sends the data (the contractor with
 * only what a print needs, the lines and the sums), the layout is made here. "Print" copies the preview into a
 * clean window and prints that, so nothing else from the page ends up on paper.
 */
const StatementPrintDialog = ({ statementID, close }: { statementID: number; close: () => void }) => {
    const data = useGetData<any>(`api/Statement/PrintStatement/${statementID}`, 'st-print', { ids: [String(statementID)] })
    const sheet = useRef<HTMLDivElement>(null)
    const p = data.data?.value

    const print = () => {
        if (!sheet.current) return
        const w = window.open('', '_blank', 'width=900,height=700')
        if (!w) return
        w.document.write(`<!doctype html><html dir="rtl" lang="fa"><head><meta charset="utf-8"><title>صورت‌حساب ${statementID}</title></head><body>${sheet.current.innerHTML}</body></html>`)
        w.document.close()
        w.focus()
        w.print()
    }

    const st = p?.statement
    const c = p?.contractor
    const lines: any[] = st?.lines ?? []
    const contractorName = c ? (c.companyName?.trim() ? c.companyName : `${c.firstName} ${c.lastName}`.trim()) : ''

    return (
        <Dialog open onClose={close} maxWidth="lg" fullWidth>
            <DialogTitle>چاپ صورت‌حساب #{statementID}</DialogTitle>
            <DialogContent dividers>
                {data.isLoading ? <CustomCircularProgress thickness={2} size={40} />
                    : !p ? <Alert severity="error">{data.data?.errorMessage ?? 'دریافت اطلاعات چاپ انجام نشد'}</Alert>
                    : (
                        <Box sx={{ overflowX: 'auto', bgcolor: '#fff', p: 2 }}>
                            <div ref={sheet}>
                                <style>{PRINT_CSS}</style>
                                <div className="st-print">
                                    <h2>صورت‌حساب پیمانکار{st.caption ? ` — ${st.caption}` : ''}</h2>
                                    <div className="box">
                                        <div><b>پیمانکار:</b> {contractorName}{c.nationalCode ? ` — کد ملی: ${c.nationalCode}` : ''}</div>
                                        <div>{[c.mobile && `موبایل: ${c.mobile}`, c.phone && `تلفن: ${c.phone}`, c.address && `نشانی: ${c.address}`].filter(Boolean).join(' — ')}</div>
                                        <div><b>شماره صورت‌حساب:</b> {st.id} — <b>بازه:</b> {day(st.fromDate)} تا {day(st.toDate)} — <b>وضعیت:</b> {st.stateName}</div>
                                    </div>

                                    <table>
                                        <thead>
                                            <tr>
                                                <th>ردیف</th><th>دستورکار</th><th>نوع</th><th>کیوسک</th><th>مراجعه</th><th>تاخیر (روز)</th>
                                                <th>مبلغ کار</th><th>ایاب و ذهاب</th><th>سایر</th><th>جریمه</th><th>جمع</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {lines.map((l, i) => (
                                                <tr key={l.id}>
                                                    <td>{num(i + 1)}</td><td>{l.workTaskID}</td><td>{l.typeName ?? ''}</td>
                                                    <td dir="ltr">{l.kioskSerial ?? ''}</td><td>{num(l.numberOfVisits)}</td><td>{num(l.delayDays)}</td>
                                                    <td>{num(l.taskAmount)}</td><td>{num(l.transportationAmount)}</td><td>{num(l.otherAmounts)}</td>
                                                    <td>{num(l.penalties)}</td><td>{num(l.lineTotal)}</td>
                                                </tr>
                                            ))}
                                            <tr className="sum">
                                                <td colSpan={6}>جمع</td>
                                                <td>{num(p.sumTaskAmounts)}</td><td>{num(p.sumTransportation)}</td><td>{num(p.sumOtherAmounts)}</td>
                                                <td>{num(p.sumPenalties)}</td><td>{num(lines.reduce((a, l) => a + Number(l.lineTotal ?? 0), 0))}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <div className="box">
                                        <div>هزینه‌های اضافی: {rial(st.otherCosts)}{st.otherCostsDescription ? ` (${st.otherCostsDescription})` : ''}</div>
                                        <div>جریمه‌های اضافی: {rial(st.otherPenalties)}{st.otherPenaltiesDescription ? ` (${st.otherPenaltiesDescription})` : ''}</div>
                                        {st.description && <div>توضیحات: {st.description}</div>}
                                    </div>
                                    <div className="total">جمع کل: {rial(st.total)}</div>
                                </div>
                            </div>
                        </Box>
                    )}
            </DialogContent>
            <DialogActions>
                <Button onClick={close}>بستن</Button>
                <Button variant="contained" onClick={print} disabled={!p}>چاپ</Button>
            </DialogActions>
        </Dialog>
    )
}

export default StatementPrintDialog
