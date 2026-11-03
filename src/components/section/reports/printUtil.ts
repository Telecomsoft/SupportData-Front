// One stylesheet for every printed sheet: the preview on screen and the clean print window both use it.
export const PRINT_CSS = `
.rp-print{direction:rtl;font-family:Tahoma,Vazirmatn,sans-serif;color:#000;font-size:12px}
.rp-print h2{text-align:center;margin:0 0 8px}
.rp-print h3{margin:10px 0 4px;font-size:13px}
.rp-print .box{border:1px solid #888;padding:6px 8px;margin-bottom:8px}
.rp-print .grid{display:flex;flex-wrap:wrap;gap:4px 16px}
.rp-print .grid div{min-width:30%}
.rp-print table{border-collapse:collapse;width:100%;margin-bottom:8px}
.rp-print th,.rp-print td{border:1px solid #888;padding:3px 5px;text-align:center}
.rp-print th{background:#eee}
.rp-print .sum td{font-weight:bold}
.rp-print .sign{display:flex;gap:16px;margin-top:24px}
.rp-print .sign div{flex:1;border:1px solid #888;height:70px;padding:4px}
.rp-print .total{font-size:14px;font-weight:bold;text-align:left}
`

/** Copies a sheet's HTML into a clean window and prints that, so nothing else from the page ends up on paper. */
export const openPrintWindow = (title: string, sheetHtml: string) => {
    const w = window.open('', '_blank', 'width=900,height=700')
    if (!w) return false
    w.document.write(`<!doctype html><html dir="rtl" lang="fa"><head><meta charset="utf-8"><title>${title}</title></head><body>${sheetHtml}</body></html>`)
    w.document.close()
    w.focus()
    w.print()
    return true
}
