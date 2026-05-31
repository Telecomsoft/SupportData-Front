/* eslint-disable */
//@ts-nocheck

import { TableCell, TableRow } from '@mui/material'
import DataGridCheckbox from '@components/general/telecomDataGrid/components/DataGridCheckbox.tsx'
import { sizeConverter } from '@utility/sizeConverter.ts'
import BlockIcon from '@mui/icons-material/Block'
import Typography from '@mui/material/Typography'
import Highlighted from '@components/general/telecomDataGrid/components/Highlighted.tsx'
import React, { memo, useState } from 'react'
import { arraysAreEqual, objectsAreEqual } from './HeaderCell.tsx'
import Grid from "@mui/material/Grid2";

function setsAreEqual(setA, setB) {
    if (setA.size !== setB.size) return false
    for (const item of setA) {
        if (!setB.has(item)) return false
    }
    return true
}

const areEqual = (prevProps, nextProps) => {
    if (!objectsAreEqual(prevProps.pinnedColumns, nextProps.pinnedColumns)) {
        return false
    }
    if (!objectsAreEqual(prevProps.columnWidths, nextProps.columnWidths)) {
        return false
    }
    if (!setsAreEqual(prevProps.selectedRows, nextProps.selectedRows)) {
        return false
    }
    if (!objectsAreEqual(prevProps.renderColumns, nextProps.renderColumns)) {
        return false
    }
    if (!objectsAreEqual(prevProps.sortDirection, nextProps.sortDirection)) {
        return false
    }
    return !arraysAreEqual(prevProps.groupByColList, nextProps.groupByColList) && (prevProps.borderInner === nextProps.borderInner)
}

const NormalRow = ({
    row,
    rowIndex,
    PinStyle,
    theme,
    pinnedColumns,
    renderColumns,
    columnWidths,
    selectedRows,
    setSelectedRows,
    setRows,
    multiSelect,
    disableRowSelection,
    fadeKey,
    isPinned,
    style,
    rowHeight,
    doubleClickFunc,
    isRowPinInMultiSelect,
    setPinnedRows,
    dataGridKeyID,
    globalFilterValue,
    selectedRef,
    rowLockSelectionCondition,
                       borderInner,
                       rowIdDif,
}) => {
    const [hoveredRow, setHoveredRow] = useState(null)
    const newSelectedRows = new Set(selectedRows)

    const getColumnStyle = (column) => {
        const style: Record<any, any> = {
            cursor: disableRowSelection || (!!rowLockSelectionCondition && rowLockSelectionCondition(row)) ? 'auto' : 'pointer',
            padding: sizeConverter(10, 'space'),
            minWidth: columnWidths[column.field] || column.minWidth || column.width || sizeConverter(100, 'width'),
            width: columnWidths[column.field] || column.minWidth || column.width || sizeConverter(100, 'width'),
            textAlign: column.align || 'right',
            position: 'relative',
            transition: '0.1s all ease-in-out',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            '& > *': {
                maxWidth: '100%',
                overflow: 'hidden',
            },
            backgroundColor: newSelectedRows.has(row[dataGridKeyID])
                ? theme.palette.dataGrid['selection']
                : hoveredRow === row[dataGridKeyID]
                  ? theme.palette.dataGrid['hover']
                  : 'inherit',
            color: 'black',
            minHeight: rowHeight,
        }

        if (pinnedColumns?.left?.includes(column.field)) {
            style.position = 'sticky'
            style.right = PinStyle(column, 'left')
            style.zIndex = 2
            style.backgroundColor = newSelectedRows.has(row[dataGridKeyID])
                ? theme.palette.dataGrid['selection']
                : hoveredRow === row[dataGridKeyID]
                  ? theme.palette.dataGrid['hover']
                  : theme.palette.dataGrid['bgRowPinColor']
        } else if (pinnedColumns?.right?.includes(column.field)) {
            style.position = 'sticky'
            style.left = PinStyle(column, 'right')
            style.zIndex = 2
            style.backgroundColor = newSelectedRows.has(row[dataGridKeyID])
                ? theme.palette.dataGrid['selection']
                : hoveredRow === row[dataGridKeyID]
                  ? theme.palette.dataGrid['hover']
                  : theme.palette.dataGrid['bgRowPinColor']
        }

        return style
    }

    const handleRowSelect = (row) => {
        if (newSelectedRows.has(row[dataGridKeyID])) {
            newSelectedRows.delete(row[dataGridKeyID])
        } else {
            newSelectedRows.add(row[dataGridKeyID])
        }
        setSelectedRows(newSelectedRows)
        setRows && setRows([...newSelectedRows])
        if (isRowPinInMultiSelect) {
            setPinnedRows((prev) => {
                return {
                    ...prev,
                    top: [...newSelectedRows],
                }
            })
        }
    }

    return (
        <TableRow
            {...(newSelectedRows.has(row[dataGridKeyID]) ? { ref: selectedRef } : {})}
            onClick={
                !disableRowSelection && !(!!rowLockSelectionCondition && rowLockSelectionCondition(row))
                    ? multiSelect
                        ? () => handleRowSelect(row)
                        : () => {
                              setSelectedRows(new Set([row[dataGridKeyID]]))
                              setRows && setRows([row[dataGridKeyID]])
                          }
                    : undefined
            }
            onDoubleClick={!!doubleClickFunc ? () => doubleClickFunc(row) : undefined}
            onMouseEnter={disableRowSelection ? undefined : () => setHoveredRow(row[dataGridKeyID])}
            onMouseLeave={disableRowSelection ? undefined : () => setHoveredRow(null)}
            sx={{
                transition: 'opacity 0.5s ease-out',
                ...(fadeKey && {
                    '@keyframes fade': {
                        '0%': {
                            opacity: 1,
                        },
                        '50%': {
                            opacity: 0.25,
                        },
                        '100%': {
                            opacity: 1,
                        },
                    },
                    animation: 'fade 1s infinite',
                }),
                ...(isPinned && {
                    ...style,
                    '&:hover': {
                        backgroundColor: theme.palette.dataGrid.bgHeaderColor,
                    },
                }),
                height: rowHeight,
            }}
        >
            {multiSelect && (
                <TableCell
                    padding="checkbox"
                    style={{
                        transition: '0.1s all ease-in-out',
                        backgroundColor: newSelectedRows.has(row[dataGridKeyID])
                            ? theme.palette.dataGrid['selection']
                            : hoveredRow === row[dataGridKeyID]
                              ? theme.palette.dataGrid['hover']
                              : 'inherit',
                        color: 'black',
                    }}
                >
                    {!!rowLockSelectionCondition && rowLockSelectionCondition(row) ? (
                        <DataGridCheckbox
                            checked={false}
                            disabled
                            sx={{ p: 0, px: sizeConverter(8, 'spaceX') }}
                            icon={<BlockIcon sx={{ width: sizeConverter(20), height: sizeConverter(20) }} />}
                        />
                    ) : (
                        <DataGridCheckbox checked={selectedRows.has(row[dataGridKeyID])} sx={{ p: 0, px: sizeConverter(8, 'spaceX') }} />
                    )}
                </TableCell>
            )}
            {renderColumns().map((column) => (
                <TableCell key={`${row[dataGridKeyID]}-${column.field}`} style={getColumnStyle(column)}>
                    {column.renderCell ? (
                        column.renderCell({ value: row[column.field], row, searchedText: globalFilterValue })
                    ) : (
                        <Typography
                            variant="caption"
                            sx={{
                                // width: columnWidths[column.field] || column.minWidth || column.width || sizeConverter(100, 'width'),
                                width: 1,
                                lineHeight: 1.2,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: '1',
                                WebkitBoxOrient: 'vertical',
                                whiteSpace: 'normal',
                            }}
                        >
                            <Highlighted highlight={globalFilterValue} text={row[column.field] ? row[column.field] : ''} />
                        </Typography>
                    )}
                    {borderInner &&
                        <Grid
                            sx={{
                                position: 'absolute',
                                right: 0,
                                top: 0,
                                backgroundColor:theme.palette.dataGrid['borderColor'],
                                height: '100%',
                                width: '2px',
                                // borderRadius: '20%',
                                transition: '0.2s all ease-in-out',
                            }}
                        />
                    }
                </TableCell>
            ))}
        </TableRow>
    )
}

export default memo(NormalRow, areEqual)
