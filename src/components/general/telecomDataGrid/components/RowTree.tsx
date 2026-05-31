/* eslint-disable */
//@ts-nocheck

import NormalRow from './NormalRow.tsx'
import { TableCell, TableRow } from '@mui/material'
import Typography from '@mui/material/Typography'
import Highlighted from './Highlighted.tsx'
import React, { memo, useState } from 'react'
import { sizeConverter } from '@utility/sizeConverter.ts'
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded'
import Grid from '@mui/material/Grid2'
import { TELECOM_DICTIONARY } from '../staticData/telecom-dictionary.ts'
import { convertToPersianNumber } from '../utils/convertToPersianNumber.ts'
import { arraysAreEqual, objectsAreEqual } from '@components/general/telecomDataGrid/components/HeaderCell.tsx'

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
    if (!setsAreEqual(prevProps.expandedTree, nextProps.expandedTree)) {
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
const RowTree = ({
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
    expandedTree,
    setExpandedTree,
    groupByColList,
    DataGridLang,
    startTransition,
                     borderInner,
                     rowIdDif,
}) => {
    const [hoveredRow, setHoveredRow] = useState(null)
    const getColumnStyle = (column) => {
        const style: Record<any, any> = {
            cursor: 'pointer',
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
            backgroundColor: hoveredRow === row[dataGridKeyID] ? theme.palette.dataGrid['hover'] : 'inherit',
            color: 'black',
            minHeight: rowHeight,
            height: rowHeight,
        }

        if (pinnedColumns?.left?.includes(column.field)) {
            style.position = 'sticky'
            style.right = PinStyle(column, 'left')
            style.zIndex = 2
            style.backgroundColor =
                hoveredRow === row[dataGridKeyID] ? theme.palette.dataGrid['hover'] : theme.palette.dataGrid['bgRowPinColor']
        } else if (pinnedColumns?.right?.includes(column.field)) {
            style.position = 'sticky'
            style.left = PinStyle(column, 'right')
            style.zIndex = 2
            style.backgroundColor =
                hoveredRow === row[dataGridKeyID] ? theme.palette.dataGrid['hover'] : theme.palette.dataGrid['bgRowPinColor']
        }

        return style
    }
    return (
        <>
            {row.subItem ? (
                <>
                    <TableRow onMouseEnter={() => setHoveredRow(row[dataGridKeyID])} onMouseLeave={() => setHoveredRow(null)}>
                        {renderColumns().map((column, index) => (
                            <TableCell
                                onClick={() => {
                                    startTransition(() => {
                                        const prevData = new Set(expandedTree)
                                        if (prevData.has(row[dataGridKeyID])) {
                                            prevData.delete(row[dataGridKeyID])
                                            setExpandedTree(prevData)
                                        } else {
                                            prevData.add(row[dataGridKeyID])
                                            setExpandedTree(prevData)
                                        }
                                    })
                                }}
                                key={`${row[dataGridKeyID]}-${column.field}-${index}`}
                                style={getColumnStyle(column)}
                            >
                                {groupByColList?.includes(column.field) && row[column.field] && (
                                    <Grid
                                        container
                                        justifyContent={'space-between'}
                                        alignItems={'center'}
                                        sx={{ direction: DataGridLang === 'FAR' ? 'ltr' : 'rtl' }}
                                    >
                                        <Grid container alignItems={'center'} size="grow">
                                            <Typography
                                                variant="normalBold"
                                                sx={{
                                                    lineHeight: 1.2,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: '1',
                                                    WebkitBoxOrient: 'vertical',
                                                    whiteSpace: 'normal',
                                                }}
                                            >
                                                <Highlighted
                                                    highlight={globalFilterValue}
                                                    text={
                                                        row[column.field]
                                                            ? row[column.field]
                                                            : groupByColList?.includes(column.field)
                                                              ? TELECOM_DICTIONARY[DataGridLang]['Empty']
                                                              : ''
                                                    }
                                                />
                                            </Typography>
                                            <Grid sx={{ px: sizeConverter(3, 'spaceX') }}>
                                                {row?.subItem?.length && (
                                                    <Typography variant="normal">
                                                        {`(${DataGridLang === 'FAR' ? convertToPersianNumber(row?.subItem?.length?.toString()) : row?.subItem?.length})`}
                                                    </Typography>
                                                )}
                                            </Grid>
                                        </Grid>
                                        <ArrowDropDownRoundedIcon
                                            sx={{
                                                width: sizeConverter(25),
                                                height: sizeConverter(25),
                                                transition: 'all 0.2s ease-in-out',
                                                rotate: expandedTree.has(row[dataGridKeyID]) ? '180deg' : '0deg',
                                            }}
                                        />
                                    </Grid>
                                )}
                            </TableCell>
                        ))}
                    </TableRow>
                    {expandedTree.has(row[dataGridKeyID]) &&
                        row.subItem.map((i) => {
                            return (
                                <RowTree
                                    row={i}
                                    rowIndex={rowIndex}
                                    PinStyle={PinStyle}
                                    theme={theme}
                                    pinnedColumns={pinnedColumns}
                                    renderColumns={renderColumns}
                                    columnWidths={columnWidths}
                                    selectedRows={selectedRows}
                                    setSelectedRows={setSelectedRows}
                                    setRows={setRows}
                                    multiSelect={multiSelect}
                                    disableRowSelection={disableRowSelection}
                                    fadeKey={fadeKey}
                                    isPinned={isPinned}
                                    style={style}
                                    rowHeight={rowHeight}
                                    doubleClickFunc={doubleClickFunc}
                                    isRowPinInMultiSelect={isRowPinInMultiSelect}
                                    setPinnedRows={setPinnedRows}
                                    dataGridKeyID={dataGridKeyID}
                                    globalFilterValue={globalFilterValue}
                                    selectedRef={selectedRef}
                                    rowLockSelectionCondition={rowLockSelectionCondition}
                                    expandedTree={expandedTree}
                                    setExpandedTree={setExpandedTree}
                                    groupByColList={groupByColList}
                                    DataGridLang={DataGridLang}
                                    startTransition={startTransition}
                                    borderInner={borderInner}
                                    rowIdDif={rowIdDif}
                                />
                            )
                        })}
                </>
            ) : (
                <NormalRow
                    row={row}
                    rowIndex={rowIndex}
                    PinStyle={PinStyle}
                    theme={theme}
                    pinnedColumns={pinnedColumns}
                    renderColumns={renderColumns}
                    columnWidths={columnWidths}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    setRows={setRows}
                    multiSelect={multiSelect}
                    disableRowSelection={disableRowSelection}
                    fadeKey={fadeKey}
                    isPinned={isPinned}
                    style={style}
                    rowHeight={rowHeight}
                    doubleClickFunc={doubleClickFunc}
                    isRowPinInMultiSelect={isRowPinInMultiSelect}
                    setPinnedRows={setPinnedRows}
                    dataGridKeyID={dataGridKeyID}
                    globalFilterValue={globalFilterValue}
                    selectedRef={selectedRef}
                    rowLockSelectionCondition={rowLockSelectionCondition}
                    borderInner={borderInner}
                    rowIdDif={rowIdDif}
                />
            )}
        </>
    )
}

export default memo(RowTree, areEqual)
