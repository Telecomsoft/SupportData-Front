/* eslint-disable */
//@ts-nocheck

import { sizeConverter } from '@utility/sizeConverter.ts'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import StyledTextField from '@components/general/input/StyledTextField.tsx'
import { Menu, MenuItem, Popover } from '@mui/material'
import React, { useMemo, useState } from 'react'
import DataGridIconProvider from '@components/general/telecomDataGrid/components/DataGridIconProvider.tsx'
import ShowChartRoundedIcon from '@mui/icons-material/ShowChartRounded'
import ViewWeekRoundedIcon from '@mui/icons-material/ViewWeekRounded'
import LockPersonRoundedIcon from '@mui/icons-material/LockPersonRounded'
import LockResetRoundedIcon from '@mui/icons-material/LockResetRounded'
import { compareObjects } from '@components/general/telecomDataGrid/utils/compareObjects.ts'
import { useTheme } from '@mui/system'
import { countStringOccurrences } from '@components/general/telecomDataGrid/utils/countStringOccurrences.ts'
import { TELECOM_DICTIONARY } from '@components/general/telecomDataGrid/staticData/telecom-dictionary.ts'
import TrendingFlatRoundedIcon from '@mui/icons-material/TrendingFlatRounded'
import ExportButton from '@components/general/telecomDataGrid/components/ExportButton.tsx'
import { debounced } from '@components/general/telecomDataGrid/utils/debounced.ts'
import BorderInnerIcon from '@mui/icons-material/BorderInner'

const DataGridToolbar = ({
    columns,
    title,
    setFilterValue,
    setServerCtrData,
    visibleColumns,
    setVisibleColumns,
    data,
    pinnedColumns,
    groupColumns,
    columnWidths,
    sortDirection,
    CustomToolBar,
    toolbarProps,
    columnConfig,
    personalConfig,
    DataGridLang,
    setIsColumnManagerOpen,
    fullSearchbar,
    setSelectedRows,
    selectedRows,
    filters,
    globalFilterValue,
    exportLock,
    dataGridKey,
    startTransition,
    borderInner,
    setBorderInner,
    borderInnerLock,
}) => {
    const theme = useTheme()
    const [lastSaved, setLastSaved] = useState(Date.now())
    const [anchorElStatus, setAnchorElStatus] = useState(null)
    const [popAnchorEl, setPopAnchorEl] = useState(null)

    const [selectedHeaderData, setSelectedHeaderData] = useState<null | Record<any, any>>(null)

    const handleStatusButtonClick = (event) => {
        setAnchorElStatus(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorElStatus(null)
    }

    const handleHeaderSelect = (event, column) => {
        const headerData = data?.map((row) => row[column.field])
        setPopAnchorEl(event.currentTarget)
        setSelectedHeaderData({ data: headerData, columnData: column })
    }

    const isColumnValueValid = (columnField) => {
        // const rowData = data?.every((row) => typeof row[columnField] === 'string')
        return false
    }

    const handleLockClick = () => {
        localStorage.setItem(`columnWidths-${dataGridKey}`, JSON.stringify(columnWidths))
        localStorage.setItem(`pinnedColumns-${dataGridKey}`, JSON.stringify(pinnedColumns))
        localStorage.setItem(`sortDirection-${dataGridKey}`, JSON.stringify(sortDirection))
        localStorage.setItem(`visibleColumns-${dataGridKey}`, JSON.stringify(visibleColumns))
        localStorage.setItem(`groupColumns-${dataGridKey}`, JSON.stringify(groupColumns))
        localStorage.setItem(`borderInner-${dataGridKey}`, JSON.stringify(borderInner))
        setLastSaved(Date.now())
    }

    const isEveryThingSaved = useMemo(() => {
        const savedWidths = localStorage.getItem(`columnWidths-${dataGridKey}`)
        const savedPinnedColumns = localStorage.getItem(`pinnedColumns-${dataGridKey}`)
        const savedSortDirection = localStorage.getItem(`sortDirection-${dataGridKey}`)
        const savedVisibleColumns = localStorage.getItem(`visibleColumns-${dataGridKey}`)
        const savedGroupColumns = localStorage.getItem(`groupColumns-${dataGridKey}`)
        const savedBorderInner = localStorage.getItem(`borderInner-${dataGridKey}`)

        return (
            compareObjects(savedPinnedColumns, pinnedColumns) &&
            compareObjects(savedVisibleColumns, visibleColumns) &&
            compareObjects(savedSortDirection, sortDirection) &&
            compareObjects(savedWidths, columnWidths) &&
            compareObjects(savedGroupColumns, groupColumns) &&
            JSON.parse(savedBorderInner) === borderInner
        )
    }, [columnWidths, pinnedColumns, sortDirection, lastSaved, borderInner, groupColumns])

    const nothingToRest = () => {
        const savedWidths = localStorage.getItem(`columnWidths-${dataGridKey}`)
        const savedPinnedColumns = localStorage.getItem(`pinnedColumns-${dataGridKey}`)
        const savedSortDirection = localStorage.getItem(`sortDirection-${dataGridKey}`)
        const savedVisibleColumns = localStorage.getItem(`visibleColumns-${dataGridKey}`)
        const savedGroupColumns = localStorage.getItem(`groupColumns-${dataGridKey}`)
        const savedBorderInner = localStorage.getItem(`borderInner-${dataGridKey}`)

        return (
            !savedWidths &&
            !savedPinnedColumns &&
            !savedSortDirection &&
            !savedVisibleColumns &&
            !savedGroupColumns &&
            !JSON.parse(savedBorderInner)
        )
    }
    const handleResetClick = () => {
        localStorage.removeItem(`columnWidths-${dataGridKey}`)
        localStorage.removeItem(`pinnedColumns-${dataGridKey}`)
        localStorage.removeItem(`sortDirection-${dataGridKey}`)
        localStorage.removeItem(`visibleColumns-${dataGridKey}`)
        localStorage.removeItem(`groupColumns-${dataGridKey}`)
        localStorage.removeItem(`borderInner-${dataGridKey}`)

        setLastSaved(null)
        window.location.reload()
    }

    return (
        <Grid container size={12} justifyContent={'space-between'} alignItems={'center'} sx={{ p: sizeConverter(6, 'space') }}>
            <Grid container size={fullSearchbar ? (CustomToolBar ? 'grow' : 12) : 6} alignItems={'center'}>
                {title && (
                    <Grid container size="auto" sx={{ mr: sizeConverter(10, 'spaceX') }}>
                        <Typography variant="boxTitle">{title}</Typography>
                    </Grid>
                )}
                <Grid container size="grow">
                    <StyledTextField
                        onChange={(e) => {
                            debounced(() => {
                                if (setServerCtrData) {
                                    setServerCtrData((prev) => {
                                        return {
                                            ...prev,
                                            globalFilter: e?.target?.value,
                                        }
                                    })
                                } else {
                                    startTransition(() => {
                                        setFilterValue(e?.target?.value)
                                    })
                                }
                            })
                        }}
                        placeholder={TELECOM_DICTIONARY[DataGridLang]['Search']}
                        sx={{
                            height: sizeConverter(24, 'height'),
                            fontSize: sizeConverter(3),
                            '& .MuiOutlinedInput-input': {
                                fontSize: sizeConverter(12),
                                minHeight: sizeConverter(24, 'height'),
                            },
                            '& label': {
                                fontSize: sizeConverter(12),
                            },
                            '& .MuiOutlinedInput-root': {
                                minHeight: sizeConverter(24, 'height'),
                            },
                        }}
                    />
                </Grid>
                {columnConfig && (
                    <DataGridIconProvider
                        Icon={ViewWeekRoundedIcon}
                        clickFunc={() => setIsColumnManagerOpen(true)}
                        extraStyle={{
                            ml: sizeConverter(3, 'spaceX'),
                        }}
                        toolTipText={TELECOM_DICTIONARY[DataGridLang]['ColumnEdit']}
                    />
                )}
                {columns.some((i) => !!i.status) && (
                    <DataGridIconProvider
                        Icon={ShowChartRoundedIcon}
                        clickFunc={handleStatusButtonClick}
                        extraStyle={{
                            ml: sizeConverter(3, 'spaceX'),
                        }}
                        toolTipText={TELECOM_DICTIONARY[DataGridLang]['ColumnStatus']}
                    />
                )}
                {personalConfig && (
                    <>
                        <DataGridIconProvider
                            Icon={LockPersonRoundedIcon}
                            clickFunc={handleLockClick}
                            color={isEveryThingSaved ? theme.palette.dataGrid['main'] : undefined}
                            extraStyle={{
                                ml: sizeConverter(3, 'spaceX'),
                            }}
                            toolTipText={TELECOM_DICTIONARY[DataGridLang]['PersonalSetting']}
                        />
                        <DataGridIconProvider
                            Icon={LockResetRoundedIcon}
                            clickFunc={handleResetClick}
                            disable={nothingToRest()}
                            extraStyle={{
                                ml: sizeConverter(3, 'spaceX'),
                            }}
                            toolTipText={TELECOM_DICTIONARY[DataGridLang]['RestPersonalSetting']}
                        />
                    </>
                )}

                {!exportLock && (
                    <ExportButton
                        data={data}
                        columns={columns}
                        visibleColumns={visibleColumns}
                        DataGridLang={DataGridLang}
                        filters={filters}
                        sortDirection={sortDirection}
                        globalFilterValue={globalFilterValue}
                        title={title}
                    />
                )}

                {!borderInnerLock && (
                    <DataGridIconProvider
                        Icon={BorderInnerIcon}
                        clickFunc={() =>
                            startTransition(() => {
                                setBorderInner((prev) => !prev)
                            })
                        }
                        extraStyle={{
                            ml: sizeConverter(3, 'spaceX'),
                        }}
                        color={borderInner ? theme.palette.dataGrid['main'] : undefined}
                        toolTipText={TELECOM_DICTIONARY[DataGridLang]['BorderInner']}
                    />
                )}

                <Menu
                    anchorEl={anchorElStatus}
                    open={Boolean(anchorElStatus)}
                    onClose={handleMenuClose}
                    sx={{ mt: sizeConverter(5, 'spaceY') }}
                >
                    {columns
                        .filter((col) => col.status)
                        ?.map((column) => (
                            <MenuItem
                                sx={{ width: sizeConverter(150, 'width'), justifyContent: 'center' }}
                                key={column.field}
                                onClick={(e) => handleHeaderSelect(e, column)}
                            >
                                {column.headerName}
                            </MenuItem>
                        ))}
                </Menu>

                {selectedHeaderData && (
                    <Popover
                        anchorEl={popAnchorEl}
                        open={Boolean(popAnchorEl)}
                        onClose={() => setPopAnchorEl(null)}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        <Grid
                            container
                            size={12}
                            justifyContent={'center'}
                            alignItems={'center'}
                            sx={{ width: sizeConverter(260, 'width') }}
                        >
                            <Typography
                                variant="boxTitle"
                                sx={{
                                    width: '100%',
                                    padding: sizeConverter(6, 'space'),
                                    textAlign: 'center',
                                    borderBottomWidth: sizeConverter(1),
                                    borderBottomStyle: 'solid',
                                    borderBottomColor: 'border.main',
                                }}
                            >
                                {selectedHeaderData?.columnData?.headerName}
                            </Typography>

                            {countStringOccurrences(selectedHeaderData?.data).length === 1 &&
                            (countStringOccurrences(selectedHeaderData?.data)[0]['name'] === 'null' ||
                                countStringOccurrences(selectedHeaderData?.data)[0]['name'] === '') ? (
                                <Typography variant="normal" sx={{ padding: sizeConverter(6, 'space') }}>
                                    {TELECOM_DICTIONARY[DataGridLang]['NODataToDisplay']}
                                </Typography>
                            ) : (
                                <Grid container justifyContent={'flex-start'} alignItems={'center'} sx={{ p: sizeConverter(12, 'space') }}>
                                    {countStringOccurrences(selectedHeaderData?.data)?.map(({ name, count }) => (
                                        <Grid container size={12} key={name} direction={DataGridLang === 'FRS' ? 'row' : 'row-reverse'}>
                                            <Typography variant="normal">{name}</Typography>
                                            <Grid size="grow">
                                                <TrendingFlatRoundedIcon sx={{ width: sizeConverter(30), height: sizeConverter(20) }} />
                                            </Grid>

                                            <Typography variant="normalBold">{count}</Typography>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </Grid>
                    </Popover>
                )}
            </Grid>
            {!!CustomToolBar && (
                <Grid container size="auto" sx={{ pl: sizeConverter(4, 'spaceX') }}>
                    <CustomToolBar toolbarProps={toolbarProps} setSelectedRows={setSelectedRows} selectedRows={selectedRows} />
                </Grid>
            )}
        </Grid>
    )
}

export default DataGridToolbar
