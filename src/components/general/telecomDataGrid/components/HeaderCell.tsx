/* eslint-disable */
//@ts-nocheck

import Grid from '@mui/material/Grid2'
import { sizeConverter } from '@utility/sizeConverter.ts'
import Typography from '@mui/material/Typography'
import DataGridIconProvider from './DataGridIconProvider.tsx'
import { TableCell } from '@mui/material'
import React, { memo, useState } from 'react'
import FilterListRounded from '@mui/icons-material/FilterListRounded'
import StraightRoundedIcon from '@mui/icons-material/StraightRounded'
import PushPinRounded from '@mui/icons-material/PushPinRounded'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import GroupWorkIcon from '@mui/icons-material/GroupWork'
import { TELECOM_DICTIONARY } from '@components/general/telecomDataGrid/staticData/telecom-dictionary.ts'

export function arraysAreEqual(arrA, arrB) {
    if (!Array.isArray(arrA) || !Array.isArray(arrB)) {
        return false // If either is not an array, they are not equal
    }

    if (arrA.length !== arrB.length) return false

    const sortedA = arrA.slice().sort()
    const sortedB = arrB.slice().sort()

    for (let i = 0; i < sortedA.length; i++) {
        if (sortedA[i] !== sortedB[i]) return false // Compare elements
    }
    return true // Arrays are equal
}

export function objectsAreEqual(objA, objB) {
    // Check if both are strictly equal
    if (objA === objB) return true

    // Check if both are objects
    if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
        return false // If they are not both objects, they are not equal
    }

    // Get the keys of both objects
    const keysA = Object.keys(objA)
    const keysB = Object.keys(objB)

    // Check if they have the same number of keys
    if (keysA?.length !== keysB?.length) return false

    // Check if all keys in objA exist in objB and have the same values
    for (let key of keysA) {
        if (!keysB.includes(key) || !objectsAreEqual(objA[key], objB[key])) {
            return false // If key is missing or values are different, not equal
        }
    }
    return true // Objects are equal
}

const areEqual = (prevProps, nextProps) => {
    if (prevProps === nextProps) return true

    if (!arraysAreEqual(prevProps.menuColumn, nextProps.menuColumn)) {
        return false
    }

    if (!arraysAreEqual(prevProps.filters, nextProps.filters)) {
        return false
    }

    // if (!objectsAreEqual(prevProps.sortDirection, nextProps.sortDirection)) {
    //     return false
    // }
    if (!arraysAreEqual(prevProps.sortDirection, nextProps.sortDirection)) {
        return false;
    }
    return arraysAreEqual(prevProps.groupByColList, nextProps.groupByColList) && prevProps.borderInner === nextProps.borderInner
}

const HeaderCell = ({
    PinStyle,
    column,
    theme,
    menuColumn,
    handleHeaderClick,
    toggleSort,
    pinnedColumns,
    setPinnedColumns,
    filters,
    setFilters,
    sortDirection,
    handleResizeStart,
    width,
    DataGridLang,
    headerHeight,
    resizeLock,
    groupByColList,
    setGroupByColList,
    setExpandedTree,
    borderInner,
    setServerCtrData,
}) => {
    const [hoveredColumn, setHoveredColumn] = useState(null)
    const [cellSortView, setCellSortView] = useState<'asc' | 'desc' | null>(null)

    const currentSortItem = sortDirection.find((s) => s.field === column.field);
    const currentSort = currentSortItem ? currentSortItem.sort : null;

    const getColumnStyle = (column) => {
        const style: Record<any, any> = {
            cursor: 'pointer',
            padding: sizeConverter(3),
            minWidth: width,
            width: width,
            height: headerHeight,
            textAlign: column.headerAlign || 'auto',
            position: 'sticky',
            transition: '0.1s all ease-in-out',
            backgroundColor: theme.palette.dataGrid['bgHeaderColor'],
            color: 'black',
            top: 0,
            zIndex: 4,
        }

        if (pinnedColumns?.left?.includes(column.field)) {
            style.right = PinStyle(column, 'left')
            style.zIndex = 5
            style.backgroundColor = theme.palette.dataGrid['bgHeaderPinColor']
        } else if (pinnedColumns?.right?.includes(column.field)) {
            style.left = PinStyle(column, 'right')
            style.zIndex = 5
            style.backgroundColor = theme.palette.dataGrid['bgHeaderPinColor']
        }

        return style
    }

    const columnOption = () => {
        return [
            {
                id: 1,
                conditionShow: groupByColList?.includes(column.field),
                icon: GroupWorkIcon,
                onClick: () => {
                    setGroupByColList((prev) => {
                        return [...prev?.filter((i) => i !== column.field)]
                    })
                    setExpandedTree(new Set())
                },
                toolTipText: TELECOM_DICTIONARY[DataGridLang]['GroupingReset'],
            },
            {
                id: 2,
                conditionShow: filters[column.field],
                icon: FilterListRounded,
                onClick: () => {
                    setFilters((prev) => {
                        const newFilters = { ...prev }
                        delete newFilters[column.field]
                        return newFilters
                    })
                },
                toolTipText: TELECOM_DICTIONARY[DataGridLang]['ColumnSearchReset'],
            },
            {
                id: 3,
                // conditionShow: (hoveredColumn === column.field || sortDirection[column.field]) && !column?.sortLock,
                // icon: StraightRoundedIcon,
                // color: sortDirection[column.field] ? theme.palette.dataGrid['main'] : theme.palette.dataGrid['actionDisable'],
                // extraStyle: {
                //     transform: sortDirection[column.field] === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
                // },
                conditionShow: (hoveredColumn === column.field || currentSort) && !column?.sortLock,
                icon: StraightRoundedIcon,
                color: currentSort ? theme.palette.dataGrid['main'] : theme.palette.dataGrid['actionDisable'],
                extraStyle: {
                    transform: currentSort === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
                },
                onClick: () => {
                    toggleSort(column.field)
                    if (setServerCtrData) {
                        setCellSortView((prev: 'asc' | 'desc' | null) => {
                            if (prev === null) {
                                return 'asc'
                            } else if (prev === 'asc') {
                                return 'desc'
                            } else return null
                        })
                    }
                },
                toolTipText: TELECOM_DICTIONARY[DataGridLang]['Sort'],
                ...(setServerCtrData
                    ? {
                        conditionShow: (hoveredColumn === column.field || cellSortView) && !column?.sortLock,
                        color: cellSortView ? theme.palette.dataGrid['main'] : theme.palette.dataGrid['actionDisable'],
                        extraStyle: {
                            transform: cellSortView === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
                        },
                    }
                    : {}),
            },
            {
                id: 4,
                conditionShow: pinnedColumns?.left?.includes(column.field) || pinnedColumns?.right?.includes(column.field),
                icon: PushPinRounded,
                onClick: () => {
                    setPinnedColumns((prev) => {
                        const newPinned = { ...prev }
                        newPinned.left = newPinned.left.filter((id) => id !== column.field)
                        newPinned.right = newPinned.right.filter((id) => id !== column.field)
                        return newPinned
                    })
                },
                toolTipText: TELECOM_DICTIONARY[DataGridLang]['RestPin'],
            },
            {
                id: 5,
                conditionShow: hoveredColumn === column.field || menuColumn?.field === column.field,
                icon: MoreVertRoundedIcon,
                onClick: (event) => handleHeaderClick(event, column),
                toolTipText: TELECOM_DICTIONARY[DataGridLang]['Options'],
            },
        ]
    }

    return (
        <TableCell
            key={column.field}
            style={getColumnStyle(column)}
            onMouseEnter={() => setHoveredColumn(column.field)}
            onMouseLeave={() => setHoveredColumn(null)}
        >
            <Grid
                container
                justifyContent={'center'}
                alignItems={'center'}
                sx={{
                    position: 'relative',
                    // ...(colIndex !== 0 && {
                    //     borderLeft: sizeConverter(1),
                    //     borderLeftColor: 'black.3',
                    //     borderLeftStyle: 'solid',
                    // }),
                }}
            >
                {column?.renderHeader ? (
                    column.renderHeader(column)
                ) : (
                    <Grid container size="grow" justifyContent={'center'} alignItems={'center'}>
                        <Typography
                            variant="normalBold"
                            noWrap
                            sx={{
                                color: 'white.0',
                                lineHeight: 1.2,
                                px: sizeConverter(10, 'space'),
                                py: sizeConverter(3, 'space'),
                            }}
                        >
                            {column.headerName}
                        </Typography>
                    </Grid>
                )}
                <Grid container size="auto" justifyContent={'center'} alignItems={'center'} sx={{ pr: sizeConverter(3, 'spaceX') }}>
                    {columnOption().map((widget) => {
                        if (widget.conditionShow) {
                            return (
                                <DataGridIconProvider
                                    key={widget?.id}
                                    color={!widget?.color ? theme?.palette?.white?.['0'] : widget?.color}
                                    size={sizeConverter(12)}
                                    Icon={widget.icon}
                                    iconColor={'black.1'}
                                    bgcolorHover={'dataGrid.headerTagColor'}
                                    clickFunc={widget?.onClick}
                                    extraStyle={widget?.extraStyle}
                                    noHover={widget?.noHover}
                                    toolTipText={widget.toolTipText}
                                />
                            )
                        }
                    })}
                </Grid>
                {!borderInner && (
                    <Grid
                        sx={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            backgroundColor:
                                pinnedColumns?.left?.includes(column.field) || pinnedColumns?.right?.includes(column.field)
                                    ? theme.palette.dataGrid['resizeArrowBlack']
                                    : theme.palette.dataGrid['resizeArrowColor'],
                            height: '100%',
                            width: '2px',
                            borderRadius: '20%',
                            cursor: !resizeLock ? 'col-resize' : 'auto',
                            transition: '0.2s all ease-in-out',
                            ...(!resizeLock
                                ? {
                                    '&:hover': {
                                        backgroundColor: theme.palette.dataGrid['resizeArrowHoverColor'],
                                    },
                                }
                                : {}),
                        }}
                        onMouseDown={!resizeLock ? (e) => handleResizeStart(e, column) : undefined}
                    />
                )}
            </Grid>
            {borderInner && (
                <Grid
                    sx={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        backgroundColor:
                            pinnedColumns?.left?.includes(column.field) || pinnedColumns?.right?.includes(column.field)
                                ? theme.palette.dataGrid['resizeArrowBlack']
                                : theme.palette.dataGrid['resizeArrowColor'],
                        height: '100%',
                        width: '2px',
                        borderRadius: '20%',
                        cursor: !resizeLock ? 'col-resize' : 'auto',
                        transition: '0.2s all ease-in-out',
                        ...(!resizeLock
                            ? {
                                '&:hover': {
                                    backgroundColor: theme.palette.dataGrid['resizeArrowHoverColor'],
                                },
                            }
                            : {}),
                    }}
                    onMouseDown={!resizeLock ? (e) => handleResizeStart(e, column) : undefined}
                />
            )}
        </TableCell>
    )
}

export default memo(HeaderCell, areEqual)
