/* eslint-disable */
//@ts-nocheck

import React, { Dispatch, memo, SetStateAction } from 'react'
import { Theme } from '@mui/system'
import RowTree from '@components/general/telecomDataGrid/components/RowTree.tsx'
import NormalRow from '@components/general/telecomDataGrid/components/NormalRow.tsx'

type RowProps = {
    row: Record<string, any>
    rowIndex: number
    rowSelection?: Record<string, any>
    setRowSelection: Dispatch<SetStateAction<Record<string, any>>>
    PinStyle?: string
    pinnedColumns?: { left?: string[]; right?: string }
    renderColumns?: any
    theme: Theme
    multiSelect?: boolean
    disableRowSelection?: boolean
    treeData?: boolean
    fadeKey: number | null
    isPinned?: boolean
    pinnedPosition?: 'top' | 'bottom'
    style?: React.CSSProperties
    rowHeight?: number
    dataGridKeyID?: string
    globalFilterValue?: null | string
    rowLockSelectionCondition?: (row: any) => void
    borderInner: boolean
    rowIdDif?: string
}

const RowContainer = ({
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
    return (
        <RowTree
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
            expandedTree={expandedTree}
            setExpandedTree={setExpandedTree}
            groupByColList={groupByColList}
            DataGridLang={DataGridLang}
            startTransition={startTransition}
            borderInner={borderInner}
            rowIdDif={rowIdDif}
        />
    )
}

export default memo(RowContainer)
