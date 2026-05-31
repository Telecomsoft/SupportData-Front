/* eslint-disable */
//@ts-nocheck

import React, { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, Typography } from '@mui/material'
import DragIndicatorRounded from '@mui/icons-material/DragIndicatorRounded'
import VisibilityRounded from '@mui/icons-material/VisibilityRounded'
import VisibilityOffRounded from '@mui/icons-material/VisibilityOffRounded'
import { TELECOM_DICTIONARY } from '../staticData/telecom-dictionary'
import { sizeConverter } from '@utility/sizeConverter.ts'
import LockRoundedIcon from '@mui/icons-material/LockRounded'

const ColumnManagerDialog = ({ open, onClose, columns, visibleColumns, setVisibleColumns, DataGridLang = 'FAR', pinnedColumns }) => {
    const [orderedColumns, setOrderedColumns] = useState([...columns])
    const [draggedItem, setDraggedItem] = useState(null)
    const [tempVisibleColumns, setTempVisibleColumns] = useState([...visibleColumns])

    const allPinColumns = [...(pinnedColumns?.right ? pinnedColumns?.right : []), ...(pinnedColumns?.left ? pinnedColumns?.left : [])]

    const condition = (value) => {
        return allPinColumns.includes(value)
    }

    useEffect(() => {
        if (open) {
            setOrderedColumns([
                ...columns.sort((a, b) => {
                    const indexA = visibleColumns.findIndex((vCol) => vCol.field === a.field)
                    const indexB = visibleColumns.findIndex((vCol) => vCol.field === b.field)
                    return indexA - indexB
                }),
            ])
            setTempVisibleColumns([...visibleColumns])
        }
    }, [open, columns, visibleColumns])

    const handleDragStart = (e, column) => {
        setDraggedItem(column)
        e.dataTransfer.effectAllowed = 'move'
    }

    const handleDragOver = (e, targetColumn) => {
        e?.preventDefault()
        if (!draggedItem) return

        const newOrderedColumns = [...orderedColumns]
        const draggedIndex = newOrderedColumns.findIndex((col) => col.field === draggedItem.field)
        const targetIndex = newOrderedColumns.findIndex((col) => col.field === targetColumn.field)

        const isDraggedVisible = tempVisibleColumns.find((vc) => vc.field === draggedItem.field)?.visible
        const isTargetVisible = tempVisibleColumns.find((vc) => vc.field === targetColumn.field)?.visible

        if (isDraggedVisible && isTargetVisible && draggedIndex !== targetIndex) {
            newOrderedColumns.splice(draggedIndex, 1)
            newOrderedColumns.splice(targetIndex, 0, draggedItem)
            setOrderedColumns(newOrderedColumns)
        }
    }

    const handleDragEnd = () => {
        setDraggedItem(null)
    }


    const toggleColumnVisibility = (field) => {
        setTempVisibleColumns((prev) =>
            prev.map((col) =>
                col.field === field
                    ? {
                          ...col,
                          visible: !col.visible,
                      }
                    : col
            )
        )
    }

    const handleSave = () => {
        const newVisibleColumns = orderedColumns.map((col) => ({
            field: col.field,
            visible: tempVisibleColumns.find((vc) => vc.field === col.field)?.visible ?? true,
        }))
        setVisibleColumns(newVisibleColumns)
        onClose()
    }

    const visibleOrderedColumns = orderedColumns.filter((col) => tempVisibleColumns.find((vc) => vc.field === col.field)?.visible)
    const hiddenOrderedColumns = orderedColumns.filter((col) => !tempVisibleColumns.find((vc) => vc.field === col.field)?.visible)

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle variant="normalHeader">{TELECOM_DICTIONARY[DataGridLang]['ColumnManager']}</DialogTitle>
            <DialogContent sx={{ display: 'flex', gap: 2, minHeight: '400px' }}>
                <div style={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold', textAlign: 'center' }}>
                        {TELECOM_DICTIONARY[DataGridLang]['VisibleColumns']}
                    </Typography>
                    <List
                        sx={{
                            bgcolor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            minHeight: sizeConverter(300, 'height'),
                        }}
                    >
                        {visibleOrderedColumns.map((column) => (
                            <ListItem
                                key={column.field}
                                draggable={!condition(column.field)}
                                onDragStart={!condition(column.field) ? (e) => handleDragStart(e, column) : undefined}
                                onDragOver={!condition(column.field) ? (e) => handleDragOver(e, column) : undefined}
                                onDragEnd={handleDragEnd}
                                sx={{
                                    cursor: !condition(column.field) ? 'move' : 'auto',
                                    '&:hover': { bgcolor: 'action.hover' },
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <DragIndicatorRounded sx={{ color: 'action.active' }} />
                                    <span>{column.headerName}</span>
                                </div>
                                {!condition(column.field) ? (
                                    <VisibilityOffRounded
                                        onClick={() => toggleColumnVisibility(column.field)}
                                        sx={{
                                            color: 'black.1',
                                            width: sizeConverter(22),
                                            height: sizeConverter(22),
                                            cursor: 'pointer',
                                            transition: '0.2s all ease-in-out',
                                            '&:hover': {
                                                color: 'primary.main',
                                            },
                                        }}
                                    />
                                ) : (
                                    <LockRoundedIcon
                                        sx={{
                                            color: 'primary.main',
                                            width: sizeConverter(22),
                                            height: sizeConverter(22),
                                        }}
                                    />
                                )}
                            </ListItem>
                        ))}
                    </List>
                </div>

                <div style={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold', textAlign: 'center' }}>
                        {TELECOM_DICTIONARY[DataGridLang]['HiddenColumns']}
                    </Typography>
                    <List
                        sx={{
                            bgcolor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            minHeight: sizeConverter(300, 'height'),
                        }}
                    >
                        {hiddenOrderedColumns.map((column) => (
                            <ListItem
                                key={column.field}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                <span>{column.headerName}</span>
                                <Button onClick={() => toggleColumnVisibility(column.field)} size="small">
                                    <VisibilityRounded />
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="main">
                    {TELECOM_DICTIONARY[DataGridLang]['Cancel']}
                </Button>
                <Button onClick={handleSave} variant="main">
                    {TELECOM_DICTIONARY[DataGridLang]['Save']}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ColumnManagerDialog
