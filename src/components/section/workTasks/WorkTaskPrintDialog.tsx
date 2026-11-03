/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from 'react'
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useGetData } from '@hooks/useGetData'
import CustomCircularProgress from '@components/general/CustomCircularProgress'
import { PRINT_CSS, openPrintWindow } from '@components/section/reports/printUtil'
import { dateFn } from '@utility/dateConverter'
import { num, rial } from '@components/section/statements/statementFormat'

const when = (d?: string | null) => (d ? dateFn(d) : '')

/**
 * The printed work task form (GET api/Report/PrintWorkTask/{id}). One data object serves all four task types
 * (fault, install, visit, other): the heading shows the type. The server sends the data, the layout is made here.
 * Only the customer's charges are printed; what the task cost us stays internal and never goes on the form.
 * "Print" copies the preview into a clean window and prints that, so nothing else from the page ends up on paper.
 */
const WorkTaskPrintDialog = ({ workTaskID, close }: { workTaskID: number; close: () => void }) => {
    const data = useGetData<any>(`api/Report/PrintWorkTask/${workTaskID}`, 'wt-print', { ids: [String(workTaskID)] })
    const sheet = useRef<HTMLDivElement>(null)
    const p = data.data?.value
    const t = p?.task

    const print = () => {
        if (sheet.current) openPrintWindow(`دستورکار ${workTaskID}`, sheet.current.innerHTML)
    }

    const partsTable = (title: string, parts: any[]) =>
        parts.length > 0 && (
            <>
                <h3>{title}</h3>
                <table>
                    <thead><tr><th>مدل قطعه</th><th>سریال</th><th>زمان</th></tr></thead>
                    <tbody>{parts.map((x, i) => <tr key={i}><td>{x.deviceModelName ?? ''}</td><td dir="ltr">{x.serial ?? ''}</td><td>{when(x.at)}</td></tr>)}</tbody>
                </table>
            </>
        )

    const customerSum = t ? Number(t.customerInspectionCost ?? 0) + Number(t.customerTransportationCost ?? 0) + Number(t.customerPartCost ?? 0) + Number(t.customerOtherCost ?? 0) : 0

    return (
        <Dialog open onClose={close} maxWidth="md" fullWidth>
            <DialogTitle>چاپ دستورکار #{workTaskID}</DialogTitle>
            <DialogContent dividers>
                {data.isLoading ? <CustomCircularProgress thickness={2} size={40} />
                    : !p ? <Alert severity="error">{data.data?.errorMessage ?? 'دریافت اطلاعات چاپ انجام نشد'}</Alert>
                    : (
                        <Box sx={{ overflowX: 'auto', bgcolor: '#fff', p: 2 }}>
                            <div ref={sheet}>
                                <style>{PRINT_CSS}</style>
                                <div className="rp-print">
                                    <h2>فرم {t.typeName ?? 'دستورکار'} — شماره {t.id}</h2>

                                    <div className="box grid">
                                        <div><b>وضعیت:</b> {t.stateName}</div>
                                        <div><b>مشتری:</b> {t.customerName ?? '-'}</div>
                                        <div><b>تاریخ چاپ:</b> {when(p.printedAt)}</div>
                                        <div><b>زمان گزارش:</b> {when(t.reportedAt)}</div>
                                        <div><b>مهلت:</b> {when(t.dueAt) || '-'}</div>
                                        <div><b>زمان اتمام:</b> {when(t.finishedAt) || '-'}</div>
                                    </div>

                                    <h3>کیوسک</h3>
                                    <div className="box grid">
                                        <div><b>سریال:</b> <span dir="ltr">{t.kioskSerial ?? '-'}</span></div>
                                        <div><b>مدل:</b> {p.kioskModelName ?? '-'}</div>
                                        <div><b>شهر:</b> {p.cityName ?? '-'}</div>
                                        <div><b>کد شعبه:</b> {p.branchCode ?? '-'}</div>
                                        <div><b>شعبه:</b> {p.branchName ?? '-'}</div>
                                        <div style={{ minWidth: '100%' }}><b>نشانی:</b> {p.kioskAddress ?? '-'}</div>
                                    </div>

                                    <div className="box grid">
                                        <div><b>تکنسین:</b> {t.assignedToName ?? '-'}</div>
                                        <div><b>پیمانکار:</b> {p.contractorName ?? '-'}</div>
                                        <div><b>تعداد مراجعه:</b> {num(t.numberOfVisits)}</div>
                                    </div>

                                    <h3>شرح مشکل</h3>
                                    <div className="box" style={{ whiteSpace: 'pre-wrap' }}>{t.reportedIssue || '-'}</div>

                                    {/* the error knowledge base is internal: the server sends it to staff only */}
                                    {(p.errors ?? []).length > 0 || t.diagnosisNote ? (
                                        <>
                                            <h3>تشخیص</h3>
                                            <div className="box" style={{ whiteSpace: 'pre-wrap' }}>
                                                {(p.errors ?? []).map((e: any, i: number) => <div key={i}><b>{e.title}</b>{e.solution ? ` — ${e.solution}` : ''}</div>)}
                                                {t.diagnosisNote}
                                            </div>
                                        </>
                                    ) : null}

                                    <h3>کار انجام‌شده</h3>
                                    <div className="box" style={{ whiteSpace: 'pre-wrap' }}>
                                        {(p.workItemNames ?? []).length ? (p.workItemNames as string[]).join('، ') : '-'}
                                        {t.workDoneNote ? `\n${t.workDoneNote}` : ''}
                                    </div>

                                    {partsTable('قطعات نصب‌شده', p.partsFitted ?? [])}
                                    {partsTable('قطعات خارج‌شده', p.partsRemoved ?? [])}

                                    <h3>هزینه‌های مشتری</h3>
                                    <table>
                                        <thead><tr><th>کارشناسی</th><th>ایاب و ذهاب</th><th>قطعه</th><th>سایر</th><th>جمع</th><th>دریافتی</th><th>شماره فاکتور</th></tr></thead>
                                        <tbody>
                                            <tr>
                                                <td>{num(t.customerInspectionCost)}</td><td>{num(t.customerTransportationCost)}</td><td>{num(t.customerPartCost)}</td>
                                                <td>{num(t.customerOtherCost)}</td><td><b>{num(customerSum)}</b></td><td>{num(t.receivedAmount)}</td><td dir="ltr">{t.invoiceNo ?? ''}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className="total">جمع هزینه‌های مشتری: {rial(customerSum)}</div>

                                    {t.description && (<><h3>توضیحات</h3><div className="box" style={{ whiteSpace: 'pre-wrap' }}>{t.description}</div></>)}

                                    <div className="sign"><div>امضای تکنسین</div><div>امضا و مهر مشتری</div></div>
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

export default WorkTaskPrintDialog
