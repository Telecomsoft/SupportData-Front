// /* eslint-disable @typescript-eslint/no-explicit-any */

// import { memo, SetStateAction, useEffect, useState } from 'react'
// import { DataType } from '@data/layout-sidebar-data'
// import TreeWrapperItem from '@components/general/tree/TreeWrapperItem'
// import findInTree, { SearchResult } from '@utility/findInTree'
// import Typography from '@mui/material/Typography'
// import Grid from '@mui/material/Grid2'
// import { sizeConverter } from '@utility/sizeConverter.ts'

// const areEqual = (
//     prevProps: {
//         data: any[]
//         searchFilter?: string | null
//         isFullWidth?: boolean
//     },
//     nextProps: {
//         data: any[]
//         searchFilter?: string | null
//         isFullWidth?: boolean
//     }
// ) => {
//     if (prevProps?.data?.length !== nextProps?.data?.length) {
//         return false
//     }
//     if (prevProps.isFullWidth !== nextProps.isFullWidth) {
//         return false
//     }
//     if (prevProps.searchFilter !== nextProps.searchFilter) {
//         return false
//     }
//     for (let i = 0; i < prevProps?.data?.length; i++) {
//         if (JSON.stringify(prevProps?.data[i]) !== JSON.stringify(nextProps?.data[i])) {
//             return false
//         }
//     }

//     return true
// }

// type CustomListItemProps = {
//     data: any
// }

// const TreeWrapper = ({
//     data,
//     isFullWidth = true,
//     treeHeight,
//     childrenSink = false,
//     treeStyle = 'tree',
//     showPictureUrlOrIcon = true,
//     valueKey = 'value',
//     titleKey = 'name',
//     pictureKey = 'pictureURL',
//     searchKey = 'item',
//     defaultSelection,
//     setSelectedOuter,
//     isSearchParams = false,
//     CustomListItemComponent,
//     searchFilter,
// }: {
//     data: any[]
//     treeHeight: number | string
//     isFullWidth?: boolean
//     setSelectedOuter?: SetStateAction<any>
//     childrenSink?: boolean
//     treeStyle?: 'layout' | 'tree' | 'none'
//     showPictureUrlOrIcon?: boolean
//     valueKey?: string
//     titleKey?: string
//     pictureKey?: string
//     searchKey?: string
//     isSearchParams?: boolean
//     defaultSelection?: any
//     CustomListItemComponent?: React.FC<CustomListItemProps>
//     searchFilter?: string | null
// }) => {
//     const [selected, setSelected] = useState<any | null>(null)
//     const [expanded, setExpanded] = useState<(number | string)[]>([])

//     const pathname = window.location.pathname

//     useEffect(() => {
//         if (defaultSelection) {
//             setSelected(defaultSelection)
//         }
//     }, [defaultSelection])

//     useEffect(() => {
//         if (treeStyle === 'layout' && !!data) {
//             const result: SearchResult = findInTree(data, valueKey, pathname.replace(/^\/+/, ''))
//             setExpanded(result.pathTree.slice(0, -1))
//             setSelected(result.object)
//         }
//     }, [data, treeStyle])

//     useEffect(() => {
//         const search = window.location.search
//         const queryParams = new URLSearchParams(search)
//         const searchValue = queryParams.get(searchKey)

//         if (treeStyle !== 'layout' && !!searchValue && !!data) {
//             const result: SearchResult = findInTree(data, valueKey, searchValue)
//             setExpanded(result.pathTree.slice(0, -1))
//             setSelected(result.object)
//             setSelectedOuter?.(result.object)
//         }
//     }, [data, searchKey, setSelectedOuter, treeStyle])

//     useEffect(() => {
//         if (defaultSelection) {
//             setSelected(defaultSelection)
//         }
//     }, [defaultSelection])

//     return (
//         <>
//             {data?.length !== 0 ? (
//                 <>
//                     {data?.map((item: DataType & { children?: DataType[] }, index: number) => {
//                         if (CustomListItemComponent) {
//                             return <CustomListItemComponent key={item.value} data={item} />
//                         } else {
//                             return (
//                                 <TreeWrapperItem
//                                     expanded={expanded}
//                                     setExpanded={setExpanded}
//                                     selected={selected}
//                                     setSelected={setSelected}
//                                     key={item.value}
//                                     data={item}
//                                     index={index}
//                                     isFullWidth={isFullWidth}
//                                     childrenSink={childrenSink}
//                                     treeStyle={treeStyle}
//                                     showPictureUrlOrIcon={showPictureUrlOrIcon}
//                                     setSelectedOuter={setSelectedOuter}
//                                     valueKey={valueKey}
//                                     titleKey={titleKey}
//                                     pictureKey={pictureKey}
//                                     searchKey={searchKey}
//                                     isSearchParams={isSearchParams}
//                                     searchFilter={searchFilter}
//                                 />
//                             )
//                         }
//                     })}
//                 </>
//             ) : (
//                 <Grid
//                     container
//                     size={12}
//                     justifyContent={'center'}
//                     alignItems={'center'}
//                     sx={{ height: typeof treeHeight === 'number' ? treeHeight - sizeConverter(20, 'height') : 'auto' }}
//                 >
//                     <Typography variant="normal">چیزی برای نمایش وجود ندارد</Typography>
//                 </Grid>
//             )}
//         </>
//     )
// }

// export default memo(TreeWrapper, areEqual)



/* eslint-disable @typescript-eslint/no-explicit-any */

import { memo, useEffect, useState } from 'react'
import { DataType } from '@data/layout-sidebar-data'
import TreeWrapperItem from '@components/general/tree/TreeWrapperItem'
import findInTree, { SearchResult } from '@utility/findInTree'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'
import { sizeConverter } from '@utility/sizeConverter.ts'

const areEqual = (
  prevProps: { data: any[]; searchFilter?: string | null; isFullWidth?: boolean },
  nextProps: { data: any[]; searchFilter?: string | null; isFullWidth?: boolean }
) => {
  if (prevProps?.data?.length !== nextProps?.data?.length) return false
  if (prevProps.isFullWidth !== nextProps.isFullWidth) return false
  if (prevProps.searchFilter !== nextProps.searchFilter) return false

  for (let i = 0; i < prevProps?.data?.length; i++) {
    if (JSON.stringify(prevProps?.data[i]) !== JSON.stringify(nextProps?.data[i])) {
      return false
    }
  }

  return true
}

type CustomListItemProps = {
  data: any
}

const TreeWrapper = ({
  data,
  isFullWidth = true,
  treeHeight,
  childrenSink = false,
  treeStyle = 'tree',
  showPictureUrlOrIcon = true,
  valueKey = 'value',
  titleKey = 'name',
  pictureKey = 'pictureURL',
  searchKey = 'item',
  defaultSelection,
  setSelectedOuter,
  isSearchParams = false,
  CustomListItemComponent,
  searchFilter,
}: {
  data: any[]
  treeHeight: number | string
  isFullWidth?: boolean
  setSelectedOuter?: (val: any) => void
  childrenSink?: boolean
  treeStyle?: 'layout' | 'tree' | 'none'
  showPictureUrlOrIcon?: boolean
  valueKey?: string
  titleKey?: string
  pictureKey?: string
  searchKey?: string
  isSearchParams?: boolean
  defaultSelection?: any
  CustomListItemComponent?: React.FC<CustomListItemProps>
  searchFilter?: string | null
}) => {
  const [selected, setSelected] = useState<any | null>(null)
  const [expanded, setExpanded] = useState<(number | string)[]>([])

  const pathname = window.location.pathname

  // ✅ انتخاب پیش‌فرض
  useEffect(() => {
    if (data && data.length > 0 && !selected) {
      if (defaultSelection) {
        setSelected(defaultSelection)
        setSelectedOuter?.(defaultSelection)
      } else {
        setSelected(data[0]) // آیتم اول
        setSelectedOuter?.(data[0])
      }
    }
  }, [data, defaultSelection, selected, setSelectedOuter])

  useEffect(() => {
    if (treeStyle === 'layout' && !!data) {
      const result: SearchResult = findInTree(data, valueKey, pathname.replace(/^\/+/, ''))
      setExpanded(result.pathTree.slice(0, -1))
      setSelected(result.object)
    }
  }, [data, treeStyle])

  useEffect(() => {
    const search = window.location.search
    const queryParams = new URLSearchParams(search)
    const searchValue = queryParams.get(searchKey)

    if (treeStyle !== 'layout' && !!searchValue && !!data) {
      const result: SearchResult = findInTree(data, valueKey, searchValue)
      setExpanded(result.pathTree.slice(0, -1))
      setSelected(result.object)
      setSelectedOuter?.(result.object)
    }
  }, [data, searchKey, setSelectedOuter, treeStyle])

  return (
    <>
      {data?.length !== 0 ? (
        <>
          {data?.map((item: DataType & { children?: DataType[] }, index: number) => {
            if (CustomListItemComponent) {
              return <CustomListItemComponent key={item.value} data={item} />
            } else {
              return (
                <TreeWrapperItem
                  expanded={expanded}
                  setExpanded={setExpanded}
                  selected={selected}
                  setSelected={setSelected}
                  key={item.value}
                  data={item}
                  index={index}
                  isFullWidth={isFullWidth}
                  childrenSink={childrenSink}
                  treeStyle={treeStyle}
                  showPictureUrlOrIcon={showPictureUrlOrIcon}
                  setSelectedOuter={setSelectedOuter}
                  valueKey={valueKey}
                  titleKey={titleKey}
                  pictureKey={pictureKey}
                  searchKey={searchKey}
                  isSearchParams={isSearchParams}
                  searchFilter={searchFilter}
                />
              )
            }
          })}
        </>
      ) : (
        <Grid
          container
          size={12}
          justifyContent={'center'}
          alignItems={'center'}
          sx={{
            height:
              typeof treeHeight === 'number'
                ? treeHeight - sizeConverter(20, 'height')
                : 'auto',
          }}
        >
          <Typography variant="normal">چیزی برای نمایش وجود ندارد</Typography>
        </Grid>
      )}
    </>
  )
}

export default memo(TreeWrapper, areEqual)

