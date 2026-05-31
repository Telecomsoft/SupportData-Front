/* eslint-disable */
//@ts-nocheck

import React, { useState } from 'react'
import { Menu, MenuItem } from '@mui/material'
import {   generateCSV,
    generatePDF,
    generateXLSX,  // New import
    downloadCSV,
    downloadPDF,
    downloadXLSX   } from '../utils/enhancedExportUtils'
import { TELECOM_DICTIONARY } from '@components/general/telecomDataGrid/staticData/telecom-dictionary'
import { TelecomColumnsType } from '@type/TelecomDataGridType'
import DataGridIconProvider from '@components/general/telecomDataGrid/components/DataGridIconProvider.tsx'
import UpgradeIcon from '@mui/icons-material/Upgrade'
import { sizeConverter } from '@utility/sizeConverter.ts'

interface ExportButtonProps {
    data: any[]
    columns: TelecomColumnsType[]
    visibleColumns: { field: string; visible: boolean }[]
    DataGridLang: 'FAR' | 'ENG'
    filters: Record<string, any>
    sortDirection: Record<string, 'asc' | 'desc'>
    globalFilterValue: string
    title?: string
}

const ExportButton: React.FC<ExportButtonProps> = ({
    data,
    columns,
    visibleColumns,
    DataGridLang,
    filters,
    sortDirection,
    globalFilterValue,
    title,
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const isRTL = DataGridLang === 'FAR'

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleExport = (type: 'csv' | 'pdf' | 'xlsx') => {
        const timestamp = new Date().toISOString().split('T')[0]
        const filename = `${title}-Export-${timestamp}`

        const exportOptions = {
            title,
            isRTL,
            filename: `${filename}.${type}`,
        }

        try {
            switch(type) {
                case 'csv':
                    const csvContent = generateCSV(data, columns, visibleColumns, filters, sortDirection, globalFilterValue, exportOptions)
                    downloadCSV(csvContent, exportOptions.filename)
                    break
                case 'pdf':
                    const doc = generatePDF(data, columns, visibleColumns, filters, sortDirection, globalFilterValue, exportOptions)
                    downloadPDF(doc, exportOptions.filename)
                    break
                case 'xlsx':
                    const workbook = generateXLSX(data, columns, visibleColumns, filters, sortDirection, globalFilterValue, exportOptions)
                    downloadXLSX(workbook, exportOptions.filename)
                    break
            }
        } catch (error) {
            console.error('Export failed:', error)
        }

        handleClose()
    }

    return (
        <>
            <DataGridIconProvider
                clickFunc={handleClick}
                Icon={UpgradeIcon}
                toolTipText={TELECOM_DICTIONARY[DataGridLang]['Export']}
                extraStyle={{
                    ml: sizeConverter(3, 'spaceX'),
                }}
            >
                {TELECOM_DICTIONARY[DataGridLang]['Export']}
            </DataGridIconProvider>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                sx={{
                    mt: sizeConverter(3, 'space'),
                }}
            >
                <MenuItem
                    onClick={() => handleExport('csv')}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}
                >
                    {TELECOM_DICTIONARY[DataGridLang]['ExportCSV']}
                </MenuItem>
                {/*<MenuItem*/}
                {/*    onClick={() => handleExport('pdf')}*/}
                {/*    sx={{*/}
                {/*        display: 'flex',*/}
                {/*        alignItems: 'center',*/}
                {/*        gap: '8px',*/}
                {/*    }}*/}
                {/*>*/}
                {/*    {TELECOM_DICTIONARY[DataGridLang]['ExportPDF']}*/}
                {/*</MenuItem>*/}
                <MenuItem
                    onClick={() => handleExport('xlsx')}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}
                >
                    {TELECOM_DICTIONARY[DataGridLang]['ExportExcel']}
                </MenuItem>
            </Menu>
        </>
    )
}

export default ExportButton
