/* eslint-disable */
//@ts-nocheck

import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx'
import 'jspdf-autotable';
import { TelecomColumnsType } from '@type/TelecomDataGridType';

interface ExportOptions {
    filename?: string;
    title?: string;
}

export const processDataForExport = (
    data: any[],
    columns: TelecomColumnsType[],
    visibleColumns: { field: string; visible: boolean }[],
    filters: Record<string, any>,
    sortDirection: Record<string, 'asc' | 'desc'>,
    globalFilterValue: string
) => {
    // Filter the columns based on visibility
    const activeColumns = columns.filter(col =>
        visibleColumns.find(vCol => vCol.field === col.field && vCol.visible)
    );

    // Filter and sort data exactly like in the data grid
    let processedData = [...data];

    // Apply global filter
    if (globalFilterValue) {
        processedData = processedData.filter(row =>
            Object.keys(row).some(field =>
                String(row[field]).toLowerCase().includes(globalFilterValue.toLowerCase())
            )
        );
    }

    // Apply column filters
    Object.entries(filters).forEach(([field, value]) => {
        processedData = processedData.filter(row =>
            String(row[field]).toLowerCase().includes(String(value).toLowerCase())
        );
    });

    // Apply sorting
    const sortField = Object.keys(sortDirection)[0];
    if (sortField) {
        const direction = sortDirection[sortField] === 'asc' ? 1 : -1;
        processedData.sort((a, b) => {
            let valueA = a[sortField];
            let valueB = b[sortField];

            // Handle numeric values
            if (!isNaN(valueA) && !isNaN(valueB)) {
                valueA = Number(valueA);
                valueB = Number(valueB);
            }

            return valueA > valueB ? direction : -direction;
        });
    }

    return { processedData, activeColumns };
};

export const generateCSV = (
    data: any[],
    columns: TelecomColumnsType[],
    visibleColumns: { field: string; visible: boolean }[],
    filters: Record<string, any>,
    sortDirection: Record<string, 'asc' | 'desc'>,
    globalFilterValue: string,
    options: ExportOptions = {}
) => {
    const { processedData, activeColumns } = processDataForExport(
        data,
        columns,
        visibleColumns,
        filters,
        sortDirection,
        globalFilterValue
    );

    // Create header row with proper alignment
    const headers = activeColumns.map(col => {
        let header = col.headerName || col.field;
        // Handle RTL text if needed
        if (col.align === 'right') {
            header = `\u200F${header}`; // Add RTL mark
        }
        return `"${header}"`;
    }).join(',');

    // Create data rows with proper alignment
    const rows = processedData.map(row => {
        return activeColumns.map(col => {
            let cellValue = row[col.field];

            // Format the cell value based on column type
            if (col.valueFormatter) {
                cellValue = col.valueFormatter(cellValue);
            }

            // Handle null/undefined
            if (cellValue === null || cellValue === undefined) {
                return '';
            }

            // Handle RTL text if needed
            if (col.align === 'right') {
                cellValue = `\u200F${cellValue}`;
            }

            // Escape special characters
            if (typeof cellValue === 'string' && (cellValue.includes(',') || cellValue.includes('\n') || cellValue.includes('"'))) {
                cellValue = `"${cellValue.replace(/"/g, '""')}"`;
            }

            return cellValue;
        }).join(',');
    });

    return [headers, ...rows].join('\n');
};

export const generatePDF = (
    data: any[],
    columns: TelecomColumnsType[],
    visibleColumns: { field: string; visible: boolean }[],
    filters: Record<string, any>,
    sortDirection: Record<string, 'asc' | 'desc'>,
    globalFilterValue: string,
    options: ExportOptions = {}
) => {
    const { processedData, activeColumns } = processDataForExport(
        data,
        columns,
        visibleColumns,
        filters,
        sortDirection,
        globalFilterValue
    );

    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'pt'
    });

    // Add title if provided
    if (options.title) {
        doc.setFontSize(16);
        doc.text(options.title, 40, 40);
    }

    // Prepare data for autoTable
    const headers = activeColumns.map(col => ({
        content: col.headerName || col.field,
        styles: {
            halign: col.align || 'left',
            fillColor: [240, 240, 240],
            textColor: [68, 68, 68],
            fontStyle: 'bold'
        }
    }));

    const tableData = processedData.map(row =>
        activeColumns.map(col => ({
            content: col.valueFormatter ? col.valueFormatter(row[col.field]) : row[col.field],
            styles: {
                halign: col.align || 'left'
            }
        }))
    );

    // Generate table
    (doc as any).autoTable({
        head: [headers],
        body: tableData,
        startY: options.title ? 60 : 40,
        styles: {
            fontSize: 10,
            cellPadding: 5
        },
        headStyles: {
            fillColor: [240, 240, 240],
            textColor: [68, 68, 68],
            fontStyle: 'bold'
        },
        alternateRowStyles: {
            fillColor: [248, 248, 248]
        },
        margin: { top: 40, right: 40, bottom: 40, left: 40 }
    });

    return doc;
};

export const downloadCSV = (csvContent: string, filename: string = 'export.csv') => {
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, filename);
    } else {
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

export const downloadPDF = (doc: any, filename: string = 'export.pdf') => {
    doc.save(filename);
};


export const generateXLSX = (
    data: any[],
    columns: any[],
    visibleColumns: { field: string; visible: boolean }[],
    filters: Record<string, any>,
    sortDirection: Record<string, 'asc' | 'desc'>,
    globalFilterValue: string,
    exportOptions: {
        title?: string,
        isRTL?: boolean,
        filename?: string
    }
) => {
    // Filter columns to only include visible columns
    const filteredColumns = columns.filter(col =>
        visibleColumns.some(vc => vc.field === col.field && vc.visible)
    )

    // Prepare header row with column names
    const headers = filteredColumns.map(col => col.headerName || col.field)

    // Prepare data rows
    const rows = data.map(item =>
        filteredColumns.map(col => {
            // Use value getter if available, otherwise use direct property access
            const value = col.valueGetter ? col.valueGetter(item) : item[col.field]
            return value ?? ''
        })
    )

    // Combine headers and data
    const worksheet = [headers, ...rows]

    // Create workbook
    const workbook = XLSX.utils.book_new()
    const worksheet_name = exportOptions.title || 'Sheet1'
    const ws = XLSX.utils.aoa_to_sheet(worksheet)

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, ws, worksheet_name)

    return workbook
}

export const downloadXLSX = (workbook: XLSX.WorkBook, filename: string) => {
    // Write workbook to file
    XLSX.writeFile(workbook, filename)
}