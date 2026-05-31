/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from 'react'
import Grid from '@mui/material/Grid2'
import { sizeConverter } from '@utility/sizeConverter.ts'
import TreeWrapper from '@components/general/tree/TreeWrapper.tsx'
import { GridSize } from '@mui/material/Grid2/Grid2'
import Typography from '@mui/material/Typography'
import SidebarToolbar from '@components/general/sidebar/SidebarToolbar.tsx'
import { Dispatch, memo, SetStateAction, useMemo, useState } from 'react'
import Skeleton from '@mui/material/Skeleton'
import SidebarFilterToolbar from '@components/general/sidebar/SidebarFilterToolbar.tsx'
import SvgComponent from '@utility/SvgComponent.tsx'
import TelecomsoftIcon from '@public/icons/Telecomsoft.svg'
import { useTheme } from '@mui/system'
import { Config, GeneralInfoProps } from '@src/data/type/infoOptionsType'

const areEqual = (
    prevProps: {
        data: any[]
        CustomComponent?: React.FC
        loading?: boolean
        isShadowMount?: boolean
        selectedItem?: unknown | null
        infoOptions?: any
        setOpenDialog?: Dispatch<SetStateAction<Record<string, 'add' | 'edit' | null>>>
    },
    nextProps: {
        data: any[]
        CustomComponent?: React.FC
        loading?: boolean
        isShadowMount?: boolean
        selectedItem?: unknown | null
        infoOptions?: any
        setOpenDialog?: Dispatch<SetStateAction<Record<string, 'add' | 'edit' | null>>>
    }
) => {
    if (prevProps.data?.length !== nextProps.data?.length) {
        return false
    }

    if (Array.isArray(prevProps.data)) {
        for (let i = 0; i < prevProps.data.length; i++) {
            if (JSON.stringify(prevProps.data[i]) !== JSON.stringify(nextProps.data[i])) {
                return false
            }
        }
    }

    if (typeof prevProps.data === 'object') {
        if (JSON.stringify(prevProps.data) !== JSON.stringify(nextProps.data)) {
            return false
        }
    }

    return (
        prevProps.CustomComponent === nextProps.CustomComponent &&
        prevProps.loading === nextProps.loading &&
        prevProps.infoOptions === nextProps.infoOptions &&
        prevProps.isShadowMount === nextProps.isShadowMount &&
        JSON.stringify(prevProps.selectedItem) === JSON.stringify(nextProps.selectedItem) &&
        JSON.stringify(prevProps.setOpenDialog) === JSON.stringify(nextProps.setOpenDialog)
    )
}

type SidebarProps = {
    title: string
    engTitle: string
    data: any[] | any
    size?: GridSize
    sidebarType?: 'info' | 'list'
    toolbarArray?: string[]
    InfoComponent?: React.FC<GeneralInfoProps>
    CustomListItemComponent?: React.FC
    treeStyle?: 'tree' | 'layout' | 'none'
    showPictureUrlOrIcon?: boolean
    isSearchParams?: boolean
    selectedItem?: unknown | null
    setSelectedItem?: Dispatch<SetStateAction<any>>
    setOpenDialog?: Dispatch<SetStateAction<Record<string, 'add' | 'edit' | null>>>
    valueKey?: string
    titleKey?: string
    pictureKey?: string
    searchKey?: string
    loading?: boolean
    scrollMaxHeight?: number | string
    sort?: boolean
    searchConfig?: boolean
    searchField?: boolean
    isShadowMount?: boolean
    infoOptions?: {
        config?: Config
        [key: string]: unknown
    }
    toolbarEditException?: boolean
    defaultSelection?: any
}

const Sidebar = ({
    title,
    engTitle,
    size = 12,
    treeStyle = 'tree',
    toolbarArray,
    showPictureUrlOrIcon = false,
    isSearchParams = false,
    selectedItem,
    setSelectedItem,
    setOpenDialog,
    data,
    sidebarType = 'list',
    InfoComponent,
    scrollMaxHeight = sizeConverter(618, 'height'),
    CustomListItemComponent,
    valueKey = 'id',
    titleKey = 'name',
    pictureKey = 'pictureURL',
    searchKey = 'item',
    sort = false,
    searchConfig = false,
    searchField = true,
    loading,
    isShadowMount = false,
    infoOptions,
    toolbarEditException = false,
    defaultSelection,
}: SidebarProps) => {
    const theme = useTheme()
    const [searchFilter, setSearchFilter] = useState<string | null>(null)

    if (sidebarType === 'info') {
        if (!InfoComponent) {
            throw new Error('InfoComponent is required when sidebarType is "info"')
        } else {
            sort = false
            searchConfig = false
            searchField = false
        }
    }

    const filterData = useMemo(() => {
        function escapeRegExp(string: string) {
            return string?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        }

        function removeSpaces(string: string) {
            return string?.replace(/\s+/g, '')
        }

        if (searchFilter) {
            const cleanedSearchFilter = removeSpaces(searchFilter.toLowerCase())

            return data.filter((itemObj: any) => {
                const itemValue = removeSpaces(itemObj?.[titleKey]?.toString()?.toLowerCase())
                return new RegExp(escapeRegExp(cleanedSearchFilter), 'ig').test(itemValue)
            })
        } else {
            return data
        }
    }, [data, searchFilter, titleKey])

    return (
        <Grid
            container
            size={size}
            justifyContent={'center'}
            alignItems={'flex-start'}
            alignContent={'flex-start'}
            sx={{
                borderWidth: sizeConverter(1),
                borderStyle: 'solid',
                borderColor: 'black.7',
                bgcolor: 'bgColor.0',
                borderRadius: sizeConverter(12, 'radius'),
                overflow: 'hidden',
            }}
        >
            {isShadowMount ? (
                <Grid
                    container
                    justifyContent={'space-evenly'}
                    alignItems={'center'}
                    alignContent={'flex-start'}
                    size={12}
                    sx={{ height: scrollMaxHeight, p: sizeConverter(6, 'space') }}
                >
                    <Grid size={12}>
                        <SvgComponent
                            width={sizeConverter(85)}
                            height={sizeConverter(85)}
                            icon={TelecomsoftIcon}
                            color={theme.palette.black?.['7']}
                        />
                    </Grid>
                    <Grid size={12} sx={{ px: sizeConverter(6, 'space') }}>
                        <Typography variant="bigHeader" sx={{ color: 'black.7' }}>
                            {title}
                        </Typography>
                    </Grid>
                </Grid>
            ) : (
                <>
                    <Grid
                        container
                        size={12}
                        justifyContent={'center'}
                        alignItems={'center'}
                        alignContent={'center'}
                        rowGap={!sort && !searchField && !searchConfig ? 0 : sizeConverter(6, 'space')}
                        sx={{
                            borderBottomWidth: sizeConverter(1),
                            borderBottomStyle: 'solid',
                            borderBottomColor: 'black.7',
                            p: sizeConverter(6, 'space'),
                        }}
                    >
                        <Grid container size={12} justifyContent={'space-between'} alignItems={'center'}>
                            <Grid container justifyContent={'flex-start'} alignItems={'center'} alignContent={'center'} size="grow">
                                {loading ? (
                                    <Skeleton height={sizeConverter(18, 'height')} width={'60%'} />
                                ) : (
                                    <Typography variant="boxTitle">{title}</Typography>
                                )}
                            </Grid>

                            <SidebarToolbar
                                loading={loading}
                                sidebarTitle={engTitle}
                                toolbarArray={toolbarArray}
                                selectedItem={selectedItem}
                                setOpenDialog={setOpenDialog}
                                toolbarEditException={toolbarEditException}
                            />
                        </Grid>

                        <SidebarFilterToolbar
                            loading={loading}
                            sort={sort}
                            searchConfig={searchConfig}
                            searchField={searchField}
                            setSearchFilter={setSearchFilter}
                        />
                    </Grid>

                    <Grid
                        container
                        size={12}
                        justifyContent={'center'}
                        alignItems={'center'}
                        alignContent={'flex-start'}
                        sx={{
                            height: loading
                                ? '100%'
                                : scrollMaxHeight
                                  ? !sort && !searchField && !searchConfig
                                      ? typeof scrollMaxHeight === 'number'
                                          ? scrollMaxHeight + sizeConverter(35, 'height')
                                          : 'auto'
                                      : scrollMaxHeight
                                  : 'auto',
                            overflowX: 'hidden',
                            overflowY: loading ? 'hidden' : 'auto',
                        }}
                    >
                        {loading ? (
                            <Skeleton variant="rectangular" sx={{ width: '100%', height: '100%' }} />
                        ) : (
                            <>
                                {sidebarType === 'list' && !InfoComponent ? (
                                    <TreeWrapper
                                        treeHeight={scrollMaxHeight}
                                        setSelectedOuter={setSelectedItem}
                                        data={filterData}
                                        valueKey={valueKey}
                                        titleKey={titleKey}
                                        pictureKey={pictureKey}
                                        searchKey={searchKey}
                                        defaultSelection={defaultSelection}
                                        CustomListItemComponent={CustomListItemComponent}
                                        treeStyle={treeStyle}
                                        showPictureUrlOrIcon={showPictureUrlOrIcon}
                                        isSearchParams={isSearchParams}
                                        searchFilter={searchFilter}
                                    />
                                ) : InfoComponent ? (
                                    <InfoComponent height={scrollMaxHeight} data={data} infoOptions={infoOptions} />
                                ) : null}
                            </>
                        )}
                    </Grid>
                </>
            )}
        </Grid>
    )
}

export default memo(Sidebar, areEqual)
