/* eslint-disable */
//@ts-nocheck

import React, {
   useState,
   useRef,
   useEffect,
   useLayoutEffect,
   useMemo,
   FunctionComponent,
   Dispatch,
   SetStateAction,
   memo,
   useTransition,
} from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Popover from '@mui/material/Popover'
import Button from '@mui/material/Button'
import TableCell from '@mui/material/TableCell'
import PushPinRounded from '@mui/icons-material/PushPinRounded'
import FilterListRounded from '@mui/icons-material/FilterListRounded'
import GroupWorkIcon from '@mui/icons-material/GroupWork'
import { sizeConverter } from '@utility/sizeConverter.ts'
import { useTheme } from '@mui/system'
import Grid from '@mui/material/Grid2'
import HeaderCell from './components/HeaderCell.tsx'
import Row from './components/RowContainer.tsx'
import DataGridCheckbox from './components/DataGridCheckbox.tsx'
import DataGridToolbar from './components/DataGridToolbar.tsx'
import LoadingBar from './components/LoadingBar.tsx'
import Typography from '@mui/material/Typography'
import SvgComponent from '@utility/SvgComponent'
import TelecomsoftIcon from '@public/icons/Telecomsoft.svg'
import StyledTextField from '@components/general/input/StyledTextField'
import { TelecomColumnsType } from '@type/TelecomDataGridType'
import { TELECOM_DICTIONARY } from './staticData/telecom-dictionary'
import DataGridFooter from './components/DataGridFooter'
import ColumnManagerDialog from './components/ColumnManagerDialog.tsx'
import { groupByArray } from './utils/groupByArray.ts'
import { ServerCtrDataType } from './staticData/TelecomDataGridType.ts'

type TelecomDataGridProps = {
   columns: TelecomColumnsType[]
   data: any
   title?: string
   height?: number
   loading?: boolean
   CustomToolBar?: FunctionComponent<any>
   toolbarProps?: any
   pinnedColumnsProps?: { left?: string[]; right?: string[] }
   updateDataObj?: Record<string, any>
   visibleRows?: number
   rowHeight?: number
   headerHeight?: number
   DataGridLang?: 'FAR' | 'ENG'
   CustomFooter?: FunctionComponent<any>
   footerProps?: any
   maxRowInPage?: number
   setRows?: Dispatch<SetStateAction<number[] | null>>
   doubleClickFunc?: (row: any) => void
   dataGridKey?: string
   dataGridKeyID?: string
   conditionClearSetRows?: boolean
   defaultRowSelectionIDs?: (number | string)[]
   scrollToView?: string
   SecondFooter?: FunctionComponent<any>
   rowLockSelectionCondition?: (row: any) => void
   visibleOrHiddenColumns?: { field: string; visible: boolean }[]
   // defaultSortColumns?: Record<string, 'desc' | 'asc'>
   defaultSortColumns?: { field: string; sort: 'asc' | 'desc' }[]
   sortFieldCustom?: {
      field: string
      func: (rowDataA: any, rowDataB: any, dir: 1 | -1) => number
   }
   defaultGroupByList?: string[]
   serverData?: {
      totalDataCount: number
      maxRowInPage: number
   }
   setServerCtrData?: Dispatch<SetStateAction<ServerCtrDataType | null>>
   isShadowMount?: boolean
   multiSelect?: boolean
   disableRowSelection?: boolean
   paginationConfig?: boolean
   columnConfig?: boolean
   personalConfig?: boolean
   isRowPinInMultiSelect?: boolean
   pinColumnLock?: boolean
   fullSearchbar?: boolean
   exportLock?: boolean
   resizeLock?: boolean
   groupByLock?: boolean
   singleGroup?: boolean
   singleSort?: boolean
   colFilterLock?: boolean
   borderInnerLock?: boolean
   defaultBorderInner?: boolean
   noBlurLoading?: boolean
   rowIdDif?: string
}

const TelecomDataGrid = ({
   columns,
   data,
   rowHeight = sizeConverter(30, 'height'),
   headerHeight = sizeConverter(30, 'height'),
   visibleRows = 100,
   title,
   loading,
   CustomToolBar,
   height = sizeConverter(608, 'height'),
   pinnedColumnsProps = { left: [], right: [] },
   updateDataObj,
   toolbarProps,
   DataGridLang = 'FAR',
   CustomFooter,
   footerProps,
   maxRowInPage = 100,
   setRows,
   doubleClickFunc,
   dataGridKeyID = 'id',
   conditionClearSetRows,
   defaultRowSelectionIDs,
   scrollToView,
   SecondFooter,
   rowLockSelectionCondition,
   dataGridKey = 'telecom',
   visibleOrHiddenColumns,
   sortFieldCustom,
   defaultSortColumns,
   serverData,
   setServerCtrData,
   defaultGroupByList,
   multiSelect = false,
   isShadowMount = false,
   disableRowSelection = false,
   paginationConfig = true,
   isRowPinInMultiSelect = false,
   fullSearchbar = false,
   columnConfig = true,
   exportLock = false,
   groupByLock = true,
   personalConfig = true,
   pinColumnLock = false,
   resizeLock = false,
   colFilterLock = false,
   singleGroup = false,
   singleSort = true,
   borderInnerLock = false,
   defaultBorderInner = false,
   noBlurLoading = false,
   rowIdDif,
}: TelecomDataGridProps) => {
   const theme = useTheme()

   const [isPending, startTransition] = useTransition()

   const [updatedKiosks, setUpdatedKiosks] = useState([])
   const [pinnedColumns, setPinnedColumns] = useState({ left: [], right: [] })
   const [scrollPosition, setScrollPosition] = useState(0)
   const [anchorEl, setAnchorEl] = useState(null)
   const [menuColumn, setMenuColumn] = useState(null)
   const [groupByColList, setGroupByColList] = useState<string[]>([])
   const [filterAnchorEl, setFilterAnchorEl] = useState(null)
   const [globalFilterValue, setGlobalFilterValue] = useState('')
   // const [sortDirection, setSortDirection] = useState({})
   const [sortDirection, setSortDirection] = useState<{ field: string; sort: 'asc' | 'desc' }[]>(defaultSortColumns || [])
   const [filters, setFilters] = useState({})
   const [columnWidths, setColumnWidths] = useState({})
   const [isResizing, setIsResizing] = useState(false)
   const [selectedRows, setSelectedRows] = useState<Set<number | string>>(
      defaultRowSelectionIDs ? new Set(defaultRowSelectionIDs) : new Set()
   )
   const [expandedTree, setExpandedTree] = useState<Set<number | string>>(new Set())
   const [visibleColumns, setVisibleColumns] = useState([])
   const [fadeKey, setFadeKey] = useState<number | null>(null)
   const [currentPage, setCurrentPage] = useState(serverData ? serverData.currentPage : 1)
   const [isColumnManagerOpen, setIsColumnManagerOpen] = useState<boolean>(false)
   const [pinnedRows, setPinnedRows] = useState({ top: [], bottom: [] })
   const [borderInner, setBorderInner] = useState<boolean>(defaultBorderInner ? defaultBorderInner : false)

   const tableRef = useRef(null)
   const resizingColumnRef = useRef(null)
   const startWidthRef = useRef(null)
   const startXRef = useRef(null)
   const selectedRef = useRef<HTMLDivElement | null>(null)
   const filterValue = useRef<HTMLInputElement | null>(null)

   useLayoutEffect(() => {
      setVisibleColumns(
         columns.map((column) => ({
            field: column.field,
            visible: true,
         }))
      )
   }, [columns])

   useEffect(() => {
      const savedWidths = localStorage.getItem(`columnWidths-${dataGridKey}`)
      const savedPinnedColumns = localStorage.getItem(`pinnedColumns-${dataGridKey}`)
      const savedSortDirection = localStorage.getItem(`sortDirection-${dataGridKey}`)
      const savedVisibleColumns = localStorage.getItem(`visibleColumns-${dataGridKey}`)
      const savedGroupColumns = localStorage.getItem(`groupColumns-${dataGridKey}`)
      const savedBorderInner = localStorage.getItem(`borderInner-${dataGridKey}`)

      if (savedWidths) {
         setColumnWidths(JSON.parse(savedWidths))
      }
      if ((savedBorderInner !== undefined && savedBorderInner !== null) || defaultBorderInner) {
         if (savedBorderInner !== undefined && savedBorderInner !== null) {
            setBorderInner(JSON.parse(savedBorderInner))
         } else {
            setBorderInner(defaultBorderInner ? defaultBorderInner : false)
         }
      }
      if (savedPinnedColumns || pinnedColumnsProps) {
         setPinnedColumns(JSON.parse(savedPinnedColumns) || pinnedColumnsProps)
      }
      if (savedSortDirection || defaultSortColumns) {
         setSortDirection(JSON.parse(savedSortDirection) || defaultSortColumns)
      }
      if (savedVisibleColumns || visibleOrHiddenColumns) {
         setVisibleColumns(JSON.parse(savedVisibleColumns) || visibleOrHiddenColumns)
      }
      if (savedGroupColumns || defaultGroupByList) {
         setGroupByColList(JSON.parse(savedGroupColumns) || defaultGroupByList)
      }
   }, [])
   const handleScroll = (event) => {
      setScrollPosition(event.target.scrollTop)
   }

   const togglePin = (columnId, side) => {
      setPinnedColumns((prev) => {
         const newPinned = { ...prev }
         const otherSide = side === 'left' ? 'right' : 'left'

         newPinned[otherSide] = newPinned[otherSide].filter((id) => id !== columnId)

         if (newPinned[side].includes(columnId)) {
            newPinned[side] = newPinned[side].filter((id) => id !== columnId)
         } else {
            newPinned[side] = [...newPinned[side], columnId]
         }
         return newPinned
      })
   }

   const handleHeaderClick = (event, column) => {
      setAnchorEl(event.currentTarget)
      setMenuColumn(column)
   }

   const handleMenuClose = () => {
      setAnchorEl(null)
      setMenuColumn(null)
   }

   const handleFilterClick = (event) => {
      setFilterAnchorEl(event.currentTarget)
   }

   const handleFilterClose = () => {
      setFilterAnchorEl(null)
      if (filterValue.current) {
         filterValue.current.value = ''
      }
   }

   const applyFilter = () => {
      const filterInputValue = filterValue.current?.value || ''
      setFilters((prev) => ({ ...prev, [menuColumn.field]: filterInputValue }))
      handleFilterClose()
      handleMenuClose()
   }

   const applyGrouping = (columnId) => {
      startTransition(() => {
         if (!singleGroup) {
            setGroupByColList((prev) => {
               if (prev.includes(columnId)) return [...prev]
               else return [...prev, columnId]
            })
         } else {
            setGroupByColList([columnId])
         }
      })
   }

   const toggleSort = (columnField) => {
      if (setServerCtrData) {
         setServerCtrData((prev) => {
            const prevSort = prev?.colSortDirection
            let finalSort = {}
            if (!prevSort?.[columnField]) {
               finalSort = {
                  ...(singleSort ? {} : prevSort),
                  [columnField]: 'asc',
               }
            } else if (prevSort?.[columnField] === 'asc') {
               finalSort = {
                  ...(singleSort ? {} : prevSort),
                  [columnField]: 'desc',
               }
            } else {
               const newSorts = { ...prevSort }
               delete newSorts[columnField]
               finalSort = newSorts
            }
            return {
               ...prev,
               colSortDirection: finalSort,
            }
         })
      } else {
         // startTransition(() => {
         //    setSortDirection((prev) => {
         //       if (!prev[columnField] || prev[columnField] === 'desc') {
         //          return {
         //             ...(singleSort ? {} : defaultSortColumns),
         //             [columnField]: 'asc',
         //          }
         //       } else if (prev[columnField] === 'asc') {
         //          return {
         //             ...(singleSort ? {} : defaultSortColumns),
         //             [columnField]: 'desc',
         //          }
         //       }
         //    })
         // })
         startTransition(() => {
            setSortDirection((prev) => {
               const existingIndex = prev.findIndex((item) => item.field === columnField);
               let newSort = [...prev];

               if (existingIndex >= 0) {
                  // اگر قبلا سورت شده بود
                  const currentSort = prev[existingIndex].sort;
                  if (currentSort === 'asc') {
                     // تغییر از صعودی به نزولی
                     newSort[existingIndex] = { ...newSort[existingIndex], sort: 'desc' };
                  } else {
                     // حذف سورت اگر دوباره کلیک شد (حالت سوم)
                     newSort.splice(existingIndex, 1);
                  }
               } else {
                  // اگر ستون جدید بود
                  if (singleSort) {
                     newSort = [{ field: columnField, sort: 'asc' }];
                  } else {
                     newSort.push({ field: columnField, sort: 'asc' });
                  }
               }
               return newSort;
            });
         });
      }
   }

   const renderColumns = () => {
      const leftPinned = columns
         ?.filter((col) => pinnedColumns?.left?.includes(col.field) && visibleColumns.find((vCol) => vCol.field === col.field)?.visible)
         ?.sort((a, b) => pinnedColumns?.left?.indexOf(a.field) - pinnedColumns?.left?.indexOf(b.field))
      const rightPinned = columns
         ?.filter((col) => pinnedColumns?.right?.includes(col.field) && visibleColumns.find((vCol) => vCol.field === col.field)?.visible)
         ?.sort((a, b) => pinnedColumns?.right?.indexOf(b.field) - pinnedColumns?.right?.indexOf(a.field))
      const unpinned = columns
         ?.filter(
            (col) =>
               !pinnedColumns?.left?.includes(col.field) &&
               !pinnedColumns?.right?.includes(col.field) &&
               visibleColumns.find((vCol) => vCol.field === col.field)?.visible
         )
         ?.sort((a, b) => {
            const indexA = visibleColumns?.findIndex((vCol) => vCol.field === a.field)
            const indexB = visibleColumns?.findIndex((vCol) => vCol.field === b.field)
            return indexA - indexB
         })
      return [...leftPinned, ...unpinned, ...rightPinned]
   }

   const globalFilter = (row, filterValue) => {
      return Object.keys(row).some((field) => {
         const targetCol = columns.find((col) => col?.field === field)
         if (!!targetCol?.valueGetter?.(row))
            return String(targetCol?.valueGetter?.(row)).trim().toLowerCase().includes(filterValue.trim().toLowerCase())
         else return String(row[field]).trim().toLowerCase().includes(filterValue.trim().toLowerCase())
      })
   }

   useEffect(() => {
      if (updateDataObj) {
         setFadeKey(updateDataObj[dataGridKeyID])
         setUpdatedKiosks((prevKiosks) => {
            if (prevKiosks?.find((i) => i[dataGridKeyID] === updateDataObj[dataGridKeyID])) {
               const filteredArray = prevKiosks.filter((obj) => obj[dataGridKeyID] !== updateDataObj[dataGridKeyID])
               return [...filteredArray, updateDataObj]
            } else {
               return [...prevKiosks, updateDataObj]
            }
         })
         setTimeout(() => {
            setFadeKey(null)
         }, 3000)
      } else {
         setUpdatedKiosks([])
      }
   }, [updateDataObj])

   const filterAndSortData = useMemo(() => {
      let finalData = data

      if (updatedKiosks.length !== 0) {
         finalData = finalData?.map((i) => {
            if (updatedKiosks?.some((someData) => someData[dataGridKeyID] === i[dataGridKeyID])) {
               return { ...updatedKiosks?.find((someData) => someData[dataGridKeyID] === i[dataGridKeyID]) }
            } else {
               return i
            }
         })
      }

      // finalData = finalData
      //    ?.filter(
      //       (row) =>
      //          Object.entries(filters).every(([field, value]) => {
      //             const targetCol = columns.find((col) => col?.field === field)
      //             if (!!targetCol?.valueGetter?.(row))
      //                return (
      //                   String(targetCol?.valueGetter?.(row)).trim().toLowerCase().includes(value.trim().toLowerCase()) ||
      //                   !![...selectedRows]?.includes(row[dataGridKeyID])
      //                )
      //             else
      //                return (
      //                   String(row[field]).trim().toLowerCase().includes(value.trim().toLowerCase()) ||
      //                   !![...selectedRows]?.includes(row[dataGridKeyID])
      //                )
      //          }) &&
      //          (!globalFilterValue || globalFilter(row, globalFilterValue) || !![...selectedRows]?.includes(row[dataGridKeyID]))
      //    )
      //    ?.sort((a, b) => {
      //       const sortFields = Object.keys(sortDirection).reverse()

      //       for (const sortField of sortFields) {
      //          const direction = sortDirection[sortField] === 'asc' ? 1 : -1

      //          if (sortFieldCustom?.field === sortField) {
      //             const customResult = sortFieldCustom.func(a, b, direction)
      //             if (customResult !== 0) return customResult
      //             continue
      //          }

      //          const valueA = a[sortField]
      //          const valueB = b[sortField]

      //          if (valueA === null || valueA === undefined) return -1 * direction
      //          if (valueB === null || valueB === undefined) return 1 * direction

      //          if (typeof valueA === 'boolean' && typeof valueB === 'boolean') {
      //             const boolResult = (valueA === valueB ? 0 : valueA ? 1 : -1) * direction
      //             if (boolResult !== 0) return boolResult
      //             continue
      //          }

      //          if (typeof valueA === 'number' && typeof valueB === 'number') {
      //             const numResult = (valueA - valueB) * direction
      //             if (numResult !== 0) return numResult
      //             continue
      //          }

      //          if (typeof valueA === 'string' && typeof valueB === 'string') {
      //             const stringResult = valueA.localeCompare(valueB) * direction
      //             if (stringResult !== 0) return stringResult
      //             continue
      //          }

      //          if (valueA instanceof Date && valueB instanceof Date) {
      //             const dateResult = (valueA.getTime() - valueB.getTime()) * direction
      //             if (dateResult !== 0) return dateResult
      //             continue
      //          }

      //          if (typeof valueA === 'number') return -1 * direction
      //          if (typeof valueB === 'number') return 1 * direction
      //       }

      //       return 0
      //    })
      finalData = finalData
         ?.filter(
            (row) =>
               Object.entries(filters).every(([field, value]) => {
                  const targetCol = columns.find((col) => col?.field === field)
                  if (!!targetCol?.valueGetter?.(row))
                     return (
                        String(targetCol?.valueGetter?.(row)).trim().toLowerCase().includes(value.trim().toLowerCase()) ||
                        !![...selectedRows]?.includes(row[dataGridKeyID])
                     )
                  else
                     return (
                        String(row[field]).trim().toLowerCase().includes(value.trim().toLowerCase()) ||
                        !![...selectedRows]?.includes(row[dataGridKeyID])
                     )
               }) &&
               (!globalFilterValue || globalFilter(row, globalFilterValue) || !![...selectedRows]?.includes(row[dataGridKeyID]))
         )
         ?.sort((a, b) => {
            // حرکت روی آرایه سورت به ترتیب اولویت
            for (const sortItem of sortDirection) {
               const { field: sortField, sort: dir } = sortItem;
               const direction = dir === 'asc' ? 1 : -1;

               if (sortFieldCustom?.field === sortField) {
                  const customResult = sortFieldCustom.func(a, b, direction);
                  if (customResult !== 0) return customResult;
                  continue;
               }

               // در صورتی که فیلد تو در تو بود (اختیاری برای اطمینان)
               const valueA = a[sortField];
               const valueB = b[sortField];

               // اگر برابر بودند، به سراغ قانون سورت بعدی (ستون بعدی) می‌رویم
               if (valueA === valueB) continue;

               if (valueA === null || valueA === undefined) return -1 * direction;
               if (valueB === null || valueB === undefined) return 1 * direction;

               if (typeof valueA === 'boolean' && typeof valueB === 'boolean') {
                  return (valueA ? 1 : -1) * direction;
               }

               if (typeof valueA === 'number' && typeof valueB === 'number') {
                  return (valueA - valueB) * direction;
               }

               if (typeof valueA === 'string' && typeof valueB === 'string') {
                  // تغییر اصلی اینجاست: اضافه شدن { numeric: true }
                  return valueA.localeCompare(valueB, undefined, { numeric: true }) * direction;
               }

               if (valueA instanceof Date && valueB instanceof Date) {
                  return (valueA.getTime() - valueB.getTime()) * direction;
               }
            }

            return 0;
         });

      if (groupByColList.length > 0 && finalData) {
         return groupByArray(finalData, groupByColList, dataGridKeyID, DataGridLang)
      } else {
         return finalData
      }
   }, [data, filters, globalFilterValue, sortDirection, updatedKiosks, groupByColList, dataGridKeyID, selectedRows])

   // const visibleData: any[] | undefined = filterAndSortData?.slice(
   //     Math.floor(scrollPosition / rowHeight),
   //     Math.floor(scrollPosition / rowHeight) + visibleRows
   // )

   const visibleData: any[] | undefined = filterAndSortData

   const PinStyle = (column, kind) => {
      return pinnedColumns[kind].indexOf(column.field) !== 0
         ? columns
            .filter((col) =>
               pinnedColumns[kind]
                  .filter(
                     (col1, index) => index < pinnedColumns[kind].indexOf(column.field)
                     // && pinnedColumns[kind].some((pin) => visibleColumns.includes(pin))
                  )
                  .includes(col.field)
            )
            .reduce((sum, target) => {
               return sum + (columnWidths[target.field] || target.width || target.minWidth || sizeConverter(100, 'width'))
            }, 0)
         : 0
   }

   const handleResizeStart = (e, column) => {
      e?.preventDefault()
      setIsResizing(true)
      resizingColumnRef.current = column
      startXRef.current = e?.clientX
      startWidthRef.current = columnWidths[column.field] || column.width || column.minWidth || sizeConverter(100, 'width')
   }

   const handleResizeEnd = () => {
      setIsResizing(false)
      resizingColumnRef.current = null
      startXRef.current = null
      startWidthRef.current = null
   }

   const handleResize = (e) => {
      if (!isResizing) return
      const column = resizingColumnRef.current
      const diffX = startXRef.current - e?.clientX
      const newWidth = Math.max(startWidthRef.current + diffX, column.minWidth || sizeConverter(100, 'width'))
      setColumnWidths((prev) => ({
         ...prev,
         [column.field]: newWidth,
      }))
   }

   useEffect(() => {
      if (isResizing) {
         window.addEventListener('mousemove', handleResize)
         window.addEventListener('mouseup', handleResizeEnd)
      }
      return () => {
         window.removeEventListener('mousemove', handleResize)
         window.removeEventListener('mouseup', handleResizeEnd)
      }
   }, [isResizing])

   useEffect(() => {
      setCurrentPage(1)
   }, [globalFilterValue, sortDirection, filters])

   useEffect(() => {
      if (defaultRowSelectionIDs) {
         setSelectedRows(new Set(defaultRowSelectionIDs))
         if (isRowPinInMultiSelect) {
            setPinnedRows((prev) => {
               return {
                  ...prev,
                  top: [...defaultRowSelectionIDs],
               }
            })
         }
         if (!!selectedRef.current && scrollToView && defaultRowSelectionIDs?.length === 1) {
            selectedRef.current?.scrollIntoView({
               behavior: 'smooth',
               block: 'center',
            })
         }
      } else if (defaultRowSelectionIDs === null) {
         setSelectedRows(new Set())
         if (isRowPinInMultiSelect) {
            setPinnedRows((prev) => {
               return {
                  ...prev,
                  top: [],
               }
            })
         }
      }
   }, [defaultRowSelectionIDs])

   const renderPinnedRows = (position: 'top' | 'bottom') => {
      if (!data) return null

      const pinnedRowIds = [...pinnedRows.top, ...pinnedRows.bottom]
      const pinnedData = data.filter((row) => pinnedRows[position].includes(row[dataGridKeyID]))

      const getBottomOffset = (index) => {
         if (position === 'bottom') {
            const remainingRows = pinnedRows.bottom.length - index - 1
            return remainingRows * rowHeight
         }
         return 0
      }

      const getTopOffset = (index) => {
         if (position === 'top') {
            return headerHeight + index * rowHeight
         }
         return 0
      }

      return pinnedData.map((row, index) => (
         <Row
            key={`pinned-${position}-${row[dataGridKeyID]}`}
            renderColumns={renderColumns}
            rowIndex={index}
            row={row}
            fadeKey={fadeKey === row[dataGridKeyID] && fadeKey}
            multiSelect={multiSelect}
            theme={theme}
            pinnedColumns={pinnedColumns}
            PinStyle={PinStyle}
            columnWidths={columnWidths}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            setRows={setRows}
            disableRowSelection={disableRowSelection}
            rowHeight={rowHeight}
            isPinned={true}
            pinnedPosition={position}
            doubleClickFunc={doubleClickFunc}
            isRowPinInMultiSelect={isRowPinInMultiSelect}
            setPinnedRows={setPinnedRows}
            style={{
               position: index < 10 ? 'sticky' : 'static',
               [position]: position === 'top' ? getTopOffset(index) : getBottomOffset(index),
               backgroundColor: theme.palette.dataGrid.bgRowPinColor,
               zIndex: 4,
            }}
            dataGridKeyID={dataGridKeyID}
            expandedTree={expandedTree}
            setExpandedTree={setExpandedTree}
            groupByColList={groupByColList}
            DataGridLang={DataGridLang}
            borderInner={borderInner}
         />
      ))
   }

   const getRegularRows = () => {
      if (!data) return []
      const pinnedRowIds = [...pinnedRows.top, ...pinnedRows.bottom]
      return filterAndSortData?.filter((row) => !pinnedRowIds.includes(row[dataGridKeyID]))
   }

   const isAllSelected =
      selectedRows.size === filterAndSortData?.filter((row) => !(rowLockSelectionCondition && rowLockSelectionCondition(row)))?.length &&
      filterAndSortData?.filter((row) => !(rowLockSelectionCondition && rowLockSelectionCondition(row)))?.length !== 0

   const handleSelectAll = () => {
      const filterData = filterAndSortData?.filter((row) => !(rowLockSelectionCondition && rowLockSelectionCondition(row)))

      if (selectedRows.size === filterData?.length) {
         setSelectedRows(new Set())
         setRows && setRows([...new Set()])
         setPinnedRows((prev) => {
            return {
               ...prev,
               top: [],
            }
         })
      } else if (data) {
         const newSelectedRows = new Set(filterData.map((row) => row[dataGridKeyID]))
         setSelectedRows(newSelectedRows)
         setRows && setRows([...newSelectedRows])
      }
   }

   useEffect(() => {
      if (conditionClearSetRows) {
         setSelectedRows(new Set())
      }
      if (isRowPinInMultiSelect) {
         setPinnedRows((prev) => {
            return {
               ...prev,
               top: [],
            }
         })
      }
   }, [conditionClearSetRows && conditionClearSetRows])

   return (
      <Grid
         // container
         size={12}
         justifyContent={'flex-start'}
         alignItems={'flex-start'}
         alignContent={'flex-start'}
         sx={{
            borderRadius: sizeConverter(12, 'radius'),
            borderWidth: sizeConverter(1),
            borderStyle: 'solid',
            borderColor: 'dataGrid.borderColor',
            bgcolor: 'bgColor.0',
            position: 'relative',
            overflow: 'hidden',
            height: !isShadowMount ? 'fit-content' : 'auto',
         }}
      >
         {isShadowMount ? (
            <Grid
               container
               justifyContent={'space-evenly'}
               alignItems={'center'}
               alignContent={'flex-start'}
               size={12}
               sx={{ height: height, p: sizeConverter(6, 'space') }}
            >
               <Grid size={12}>
                  <SvgComponent
                     width={sizeConverter(85)}
                     height={sizeConverter(85)}
                     icon={TelecomsoftIcon as any}
                     color={theme.palette.dataGrid?.['borderColor']}
                  />
               </Grid>
               <Grid size={12} sx={{ px: sizeConverter(6, 'space') }}>
                  <Typography variant="bigHeader" sx={{ color: 'dataGrid.borderColor' }}>
                     {title}
                  </Typography>
               </Grid>
            </Grid>
         ) : (
            <>
               <DataGridToolbar
                  columns={columns}
                  title={title}
                  data={data}
                  visibleColumns={visibleColumns}
                  setVisibleColumns={setVisibleColumns}
                  setFilterValue={setGlobalFilterValue}
                  setServerCtrData={setServerCtrData}
                  startTransition={startTransition}
                  columnWidths={columnWidths}
                  pinnedColumns={pinnedColumns}
                  sortDirection={sortDirection}
                  CustomToolBar={CustomToolBar}
                  toolbarProps={toolbarProps}
                  columnConfig={columnConfig}
                  personalConfig={personalConfig}
                  DataGridLang={DataGridLang}
                  setIsColumnManagerOpen={setIsColumnManagerOpen}
                  fullSearchbar={fullSearchbar}
                  setSelectedRows={setSelectedRows}
                  selectedRows={selectedRows}
                  filters={filters}
                  globalFilterValue={globalFilterValue}
                  exportLock={exportLock}
                  dataGridKey={dataGridKey}
                  groupColumns={groupByColList}
                  borderInner={borderInner}
                  borderInnerLock={borderInnerLock}
                  setBorderInner={setBorderInner}
               />
               <Grid
                  container
                  sx={{
                     px: sizeConverter(6, 'space'),
                     overflow: 'hidden',
                  }}
               >
                  <TableContainer
                     sx={{
                        ...(height && { height: height }),
                        overflow: 'auto',
                        position: 'relative',
                        borderTopRightRadius: sizeConverter(25, 'radius'),
                        borderTopLeftRadius: sizeConverter(25, 'radius'),
                     }}
                     // onScroll={handleScroll}
                     ref={tableRef}
                  >
                     <Table
                        style={{
                           borderCollapse: 'separate',
                           position: 'relative',
                        }}
                     >
                        <TableHead>
                           <TableRow>
                              {multiSelect && (
                                 <TableCell
                                    padding="checkbox"
                                    style={{
                                       backgroundColor: theme.palette.dataGrid['bgHeaderColor'],
                                       position: 'sticky',
                                       top: 0,
                                       zIndex: 3,
                                    }}
                                 >
                                    <DataGridCheckbox
                                       checked={isAllSelected}
                                       onClick={handleSelectAll}
                                       isHeader={true}
                                       sx={{ p: 0, px: sizeConverter(8, 'spaceX') }}
                                    />
                                 </TableCell>
                              )}
                              {renderColumns()?.map((column) => (
                                 <HeaderCell
                                    key={column.field}
                                    PinStyle={PinStyle}
                                    headerHeight={headerHeight}
                                    column={column}
                                    handleHeaderClick={handleHeaderClick}
                                    pinnedColumns={pinnedColumns}
                                    filters={filters}
                                    setFilters={setFilters}
                                    theme={theme}
                                    handleResizeStart={handleResizeStart}
                                    menuColumn={menuColumn}
                                    setPinnedColumns={setPinnedColumns}
                                    sortDirection={sortDirection}
                                    toggleSort={toggleSort}
                                    groupByColList={groupByColList}
                                    setGroupByColList={setGroupByColList}
                                    DataGridLang={DataGridLang}
                                    width={columnWidths[column.field] || column.width || column.minWidth || sizeConverter(100, 'width')}
                                    resizeLock={resizeLock}
                                    setExpandedTree={setExpandedTree}
                                    borderInner={borderInner}
                                    setServerCtrData={setServerCtrData}
                                 />
                              ))}
                           </TableRow>
                        </TableHead>
                        {!noBlurLoading && (
                           <TableBody
                              sx={{
                                 height: !isPending && !loading ? 0 : '100%',
                                 width: !isPending && !loading ? 0 : '100%',
                                 position: 'absolute',
                                 backdropFilter: 'blur(4px)',
                                 WebkitBackdropFilter: 'blur(4px)',
                                 transition: 'all 0.4s ease-in-out',
                                 visibility: !isPending && !loading ? 'hidden' : 'auto',
                                 opacity: !isPending && !loading ? 0 : 1,
                                 backgroundColor: 'rgba(255, 255, 255, 0.6)',
                                 background: 'rgba(255, 255, 255, 0)',
                                 zIndex: 3,
                              }}
                           />
                        )}
                        <TableBody>
                           {(loading || isPending) && (
                              <TableRow sx={{ position: 'sticky', top: headerHeight, zIndex: 20 }}>
                                 <LoadingBar />
                              </TableRow>
                           )}
                           {renderPinnedRows('top')}
                           {(paginationConfig && !serverData
                              ? getRegularRows()?.slice(
                                 currentPage === 1 ? 0 : (currentPage - 1) * maxRowInPage,
                                 currentPage === 1 ? maxRowInPage : currentPage * maxRowInPage
                              )
                              : getRegularRows()
                           )?.map((row, rowIndex) => (
                              <Row
                                 key={`${rowIdDif ? rowIdDif : ''}/${row[dataGridKeyID]}/${rowIndex}`}
                                 renderColumns={renderColumns}
                                 rowIndex={rowIndex}
                                 row={row}
                                 rowIdDif={rowIdDif}
                                 fadeKey={fadeKey === row[dataGridKeyID] && fadeKey}
                                 multiSelect={multiSelect}
                                 theme={theme}
                                 pinnedColumns={pinnedColumns}
                                 PinStyle={PinStyle}
                                 columnWidths={columnWidths}
                                 selectedRows={selectedRows}
                                 setSelectedRows={setSelectedRows}
                                 setRows={setRows}
                                 disableRowSelection={disableRowSelection}
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
                              />
                           ))}
                           {renderPinnedRows('bottom')}
                        </TableBody>
                     </Table>
                     <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        sx={{ mt: sizeConverter(5, 'spaceY') }}
                        anchorOrigin={{
                           vertical: 'bottom',
                           horizontal: 'center',
                        }}
                        transformOrigin={{
                           vertical: 'top',
                           horizontal: 'center',
                        }}
                     >
                        {!pinColumnLock && (
                           <MenuItem
                              onClick={() => {
                                 togglePin(menuColumn.field, 'left')
                                 handleMenuClose()
                              }}
                           >
                              <PushPinRounded
                                 style={{
                                    marginLeft: '8px',
                                    transform: 'rotate(30deg)',
                                 }}
                              />{' '}
                              {TELECOM_DICTIONARY[DataGridLang]['PinToRight']}
                           </MenuItem>
                        )}

                        {!pinColumnLock && (
                           <MenuItem
                              onClick={() => {
                                 togglePin(menuColumn.field, 'right')
                                 handleMenuClose()
                              }}
                           >
                              <PushPinRounded
                                 style={{
                                    marginLeft: '8px',
                                    transform: 'rotate(-30deg)',
                                 }}
                              />{' '}
                              {TELECOM_DICTIONARY[DataGridLang]['PinToLeft']}
                           </MenuItem>
                        )}

                        {!groupByLock && (
                           <MenuItem
                              onClick={() => {
                                 applyGrouping(menuColumn.field)
                                 // togglePin(menuColumn.field, 'right')
                                 handleMenuClose()
                              }}
                           >
                              <GroupWorkIcon
                                 style={{
                                    marginLeft: '8px',
                                 }}
                              />{' '}
                              {TELECOM_DICTIONARY[DataGridLang]['GroupBy']}
                           </MenuItem>
                        )}

                        {!colFilterLock && (
                           <MenuItem onClick={handleFilterClick}>
                              <FilterListRounded style={{ marginLeft: '8px' }} /> {TELECOM_DICTIONARY[DataGridLang]['SearchInColumn']}
                           </MenuItem>
                        )}
                     </Menu>
                     {!colFilterLock && (
                        <Popover
                           open={Boolean(filterAnchorEl)}
                           anchorEl={filterAnchorEl}
                           onClose={handleFilterClose}
                           anchorOrigin={{
                              vertical: 'top',
                              horizontal: 'left',
                           }}
                           transformOrigin={{
                              vertical: 'top',
                              horizontal: 'right',
                           }}
                        >
                           <Grid sx={{ padding: sizeConverter(6, 'space') }}>
                              <StyledTextField
                                 placeholder={TELECOM_DICTIONARY[DataGridLang]['Search']}
                                 inputRef={filterValue}
                                 style={{ marginBottom: sizeConverter(8, 'height') }}
                              />
                              <Button onClick={applyFilter} variant="main">
                                 {TELECOM_DICTIONARY[DataGridLang]['Search']}
                              </Button>
                           </Grid>
                        </Popover>
                     )}
                  </TableContainer>
               </Grid>
               <DataGridFooter
                  DataGridLang={DataGridLang!}
                  currentPage={currentPage}
                  onPageChange={(page) => {
                     setCurrentPage(page)
                     if (setServerCtrData) {
                        setServerCtrData((prev) => {
                           return {
                              ...prev,
                              currentPage: page,
                           }
                        })
                     }
                  }}
                  maxRowInPage={serverData ? serverData.maxRowInPage : maxRowInPage!}
                  totalCount={serverData ? serverData.totalDataCount : (filterAndSortData?.length ?? 0)}
                  paginationConfig={paginationConfig!}
                  CustomFooter={CustomFooter}
                  footerProps={footerProps}
                  setSelectedRows={setSelectedRows}
                  selectedRows={selectedRows}
                  multiSelect={multiSelect}
                  SecondFooter={SecondFooter}
                  startTransition={startTransition}
               />
               {(loading || visibleData?.length === 0) && (
                  <Grid
                     container
                     size={12}
                     justifyContent={'center'}
                     alignItems={'center'}
                     sx={{
                        position: 'absolute',
                        zIndex: 10,
                        textAlign: 'center',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 'auto',
                        height: '100%',
                        pointerEvents: 'none',
                     }}
                  >
                     <Typography variant="normalBold">
                        {(visibleData?.length === 0 || !visibleData) && !loading
                           ? TELECOM_DICTIONARY[DataGridLang]['NODataToDisplay']
                           : TELECOM_DICTIONARY[DataGridLang]['DataQuerying']}
                     </Typography>
                  </Grid>
               )}
            </>
         )}
         {columnConfig && (
            <ColumnManagerDialog
               open={isColumnManagerOpen}
               onClose={() => setIsColumnManagerOpen(false)}
               columns={columns}
               pinnedColumns={pinnedColumns}
               visibleColumns={visibleColumns}
               setVisibleColumns={setVisibleColumns}
               DataGridLang={DataGridLang}
            />
         )}
      </Grid>
   )
}

export default memo(TelecomDataGrid)
