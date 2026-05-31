/* eslint-disable @typescript-eslint/no-explicit-any */

import { sizeConverter } from '@utility/sizeConverter'
import Grid from '@mui/material/Grid2'
import SvgComponent from '@utility/SvgComponent'
import Typography from '@mui/material/Typography'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { Dispatch, memo, SetStateAction, useMemo } from 'react'
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded'
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded'
import IndeterminateCheckBoxRoundedIcon from '@mui/icons-material/IndeterminateCheckBoxRounded'
import { useTheme } from '@mui/system'
import ImageComponent from '@components/general/ImageComponent.tsx'
import Highlighted from '@utility/Highlighted.tsx'

const areEqual = (
    prevProps: {
        data: any
        expanded: (number | string)[]
        selected: any
        isFullWidth?: boolean
        index?: number
        childrenSink: boolean
        treeStyle: 'layout' | 'tree' | 'none'
        showPictureUrlOrIcon?: boolean
        valueKey: string
        titleKey: string
        pictureKey: string
        searchKey: string
        isSearchParams: boolean
        searchFilter?: string | null
    },
    nextProps: {
        data: any
        expanded: (number | string)[]
        selected: any
        isFullWidth?: boolean
        index?: number
        childrenSink: boolean
        treeStyle: 'layout' | 'tree' | 'none'
        showPictureUrlOrIcon?: boolean
        valueKey: string
        titleKey: string
        pictureKey: string
        searchKey: string
        isSearchParams: boolean
        searchFilter?: string | null
    }
) => {
    const deepEqualArray = (arr1: (number | string)[], arr2: (number | string)[]) => {
        if (arr1.length !== arr2.length) return false
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false
        }
        return true
    }

    if (!deepEqualArray(prevProps.expanded, nextProps.expanded)) {
        return false
    }

    if (prevProps.isFullWidth !== nextProps.isFullWidth) {
        return false
    }

    if (JSON.stringify(prevProps.data) !== JSON.stringify(nextProps.data)) {
        return false
    }

    if (JSON.stringify(prevProps.selected) !== JSON.stringify(nextProps.selected)) {
        return false
    }

    if (prevProps.childrenSink !== nextProps.childrenSink) {
        return false
    }

    if (prevProps.treeStyle !== nextProps.treeStyle) {
        return false
    }

    if (prevProps.searchFilter !== nextProps.searchFilter) {
        return false
    }

    return true
}

const TreeWrapperItem = ({
    data,
    index,
    isFullWidth,
    childrenSink,
    treeStyle,
    showPictureUrlOrIcon,
    valueKey,
    titleKey,
    pictureKey,
    searchKey,
    selected,
    setSelected,
    setSelectedOuter,
    expanded,
    setExpanded,
    isSearchParams,
    searchFilter,
}: {
    isFullWidth?: boolean
    index?: number
    data: any
    expanded: (number | string)[]
    setExpanded: Dispatch<SetStateAction<(number | string)[]>>
    selected: any
    setSelected: SetStateAction<any>
    setSelectedOuter?: SetStateAction<any>
    childrenSink: boolean
    treeStyle: 'layout' | 'tree' | 'none'
    showPictureUrlOrIcon?: boolean
    valueKey: string
    titleKey: string
    pictureKey: string
    searchKey: string
    isSearchParams: boolean
    searchFilter?: string | null
}) => {
    const theme = useTheme()
    // const navigate = useNavigate()

    const navigate = (to: string) => {
        window.history.pushState(null, '', to)
    }

    const addOrUpdateQueryParam = (param: string, value: string) => {
        const url = new URL(window.location.href)
        url.searchParams.set(param, value)
        window.history.pushState(null, '', url.toString())
    }

    const handleOpenTree = (data: any) => {
        if (!!data.children && data.children.length !== 0 && !!data?.[valueKey]) {
            setExpanded((prevState: (number | string)[]) => [
                ...(prevState?.includes(data?.[valueKey])
                    ? [...prevState.filter((i: number | string) => i !== data?.[valueKey])]
                    : [...prevState, data?.[valueKey]]),
            ])
        }

        if (isSearchParams) {
            addOrUpdateQueryParam(searchKey, data?.[valueKey]?.toString())
        }

        if (data?.link && treeStyle === 'layout') {
            navigate(data.link)
        }
        setSelected(data)
        if (setSelectedOuter) {
            setSelectedOuter(data)
        }
    }

    const childrenSinkLogic: boolean = childrenSink && index == undefined

    const TreeIconStyle = useMemo(() => {
        if (expanded.includes(data[valueKey])) {
            return IndeterminateCheckBoxRoundedIcon
        } else if (data.children) {
            return AddBoxRoundedIcon
        } else {
            return DisabledByDefaultRoundedIcon
        }
    }, [data, valueKey, expanded])

    const treeStyleObj: Record<
        string,
        {
            height: string | number
            fontStyle: 'subItem' | 'subHeader'
            iconSize: number
        }
    > = {
        layout: {
            height: sizeConverter(childrenSinkLogic ? 34 : 42, 'height'),
            fontStyle: childrenSinkLogic ? 'subItem' : 'subHeader',
            iconSize: sizeConverter(childrenSinkLogic ? 16 : 20),
        },
        tree: {
            height: sizeConverter(28, 'height'),
            fontStyle: 'subItem',
            iconSize: sizeConverter(16),
        },
        none: { height: sizeConverter(28, 'height'), fontStyle: 'subItem', iconSize: sizeConverter(16) },
    }

    return (
        <>
            <Grid
                container
                size={12}
                onClick={() => handleOpenTree(data)}
                sx={{
                    ...(treeStyle === 'layout' && !!data?.children
                        ? { pl: isFullWidth ? sizeConverter(22, 'spaceX') : sizeConverter(14, 'spaceX') }
                        : {}),
                    ...(treeStyle === 'layout' && !data?.children
                        ? { pl: isFullWidth ? sizeConverter(3, 'spaceX') : sizeConverter(1, 'spaceX') }
                        : {}),
                }}
            >
                <Grid
                    size={12}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    container
                    sx={{
                        transition: 'all 0.1s ease-in-out',
                        minHeight: treeStyleObj[treeStyle].height,
                        cursor: 'pointer',
                        color: treeStyle === 'layout' ? 'white.0' : 'black.1',
                        ...(selected?.[valueKey] === data?.[valueKey] && {
                            backgroundColor: treeStyle === 'layout' ? 'rgba(255, 255, 255, 0.25)' : 'primary.main',
                            color: 'white.0',
                        }),
                        ...(treeStyle === 'layout' &&
                            !!data?.children && {
                                borderBottomColor: 'white.0',
                                borderBottomStyle: 'solid',
                                borderBottomWidth: sizeConverter(1),
                                ...(index === 0 && {
                                    borderTopColor: 'white.0',
                                    borderTopStyle: 'solid',
                                    borderTopWidth: sizeConverter(1),
                                }),
                            }),

                        '&:hover': {
                            ...(!(selected?.[valueKey] === data?.[valueKey]) && {
                                backgroundColor: treeStyle === 'layout' ? 'rgba(255, 255, 255, 0.25)' : 'primary.main',
                                color:'white.0' ,
                            }),
                        },
                    }}
                >
                    <Grid
                        container
                        size="grow"
                        alignItems={'center'}
                        columnSpacing={sizeConverter(5, 'spaceX')}
                        sx={{
                            flexWrap: 'nowrap',
                            pl: sizeConverter(5, 'spaceX'),
                        }}
                    >
                        {treeStyle === 'tree' && (
                            <Grid container alignItems={'center'} justifyContent={'center'} size="auto">
                                <TreeIconStyle
                                    sx={{
                                        height: sizeConverter(14),
                                        width: sizeConverter(14),
                                        color: selected?.[valueKey] === data?.[valueKey] ? 'white.0' : 'inherit',
                                        opacity: !data.children ? 0.25 : 1,
                                    }}
                                />
                            </Grid>
                        )}
                        {showPictureUrlOrIcon && (
                            <>
                                {(!!data[pictureKey] || !!data.icon) && !data[pictureKey] ? (
                                    <Grid container alignItems={'center'} justifyContent={'center'} size="auto">
                                        <SvgComponent
                                            icon={data.icon}
                                            height={treeStyleObj[treeStyle].iconSize}
                                            width={treeStyleObj[treeStyle].iconSize}
                                            color={selected?.[valueKey] === data?.[valueKey] ? theme.palette.white['0'] : 'inherit'}
                                        />
                                    </Grid>
                                ) : (
                                    <Grid container alignItems={'center'} justifyContent={'center'} size="auto">
                                        <ImageComponent
                                            src={data[pictureKey]}
                                            height={sizeConverter(20)}
                                            width={sizeConverter(20)}
                                            alt="Pic"
                                        />
                                    </Grid>
                                )}
                            </>
                        )}

                        <Grid container alignItems={'center'} justifyContent={'flex-start'} size="grow">
                            {isFullWidth && (
                                <Typography
                                    variant={treeStyleObj[treeStyle].fontStyle}
                                    sx={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: '2',
                                        WebkitBoxOrient: 'vertical',
                                        color: selected?.[valueKey] === data?.[valueKey] ? 'white.0' : 'inherit',
                                    }}
                                >
                                    <Highlighted highlight={searchFilter?.toString()} text={data?.[titleKey]} />
                                </Typography>
                            )}
                        </Grid>
                    </Grid>
                    {!!data.children && data.children.length !== 0 && treeStyle === 'layout' && (
                        <ArrowDropDownIcon
                            sx={{
                                color: selected?.[valueKey] === data?.[valueKey] ? 'white.0' : 'inherit',
                                height: sizeConverter(20),
                                width: sizeConverter(20),
                                transition: 'rotate 0.2s ease-in-out',
                                rotate: expanded.includes(data?.[valueKey]) ? '180deg' : 0,
                            }}
                        />
                    )}
                </Grid>
            </Grid>
            {!!data.children &&
                expanded.includes(data?.[valueKey]) &&
                data.children.map((item: any, index: number) => {
                    return (
                        <Grid
                            key={data?.[valueKey]}
                            container
                            size={12}
                            sx={{
                                pl: isFullWidth ? sizeConverter(0, 'spaceX') : sizeConverter(5, 'spaceX'),
                                ...(treeStyle === 'layout' &&
                                    expanded.includes(data?.[valueKey]) && {
                                        mt: index === 0 ? sizeConverter(3, 'spaceY') : 0,
                                        mb: index === data?.children?.length - 1 ? sizeConverter(3, 'spaceY') : 0,
                                        borderLeftColor: 'white.0',
                                        borderLeftStyle: 'dashed',
                                        borderLeftWidth: sizeConverter(1),
                                        ml: isFullWidth ? sizeConverter(36, 'spaceX') : sizeConverter(28, 'spaceX'),
                                    }),
                                ...(treeStyle === 'tree' &&
                                    expanded.includes(data?.[valueKey]) && {
                                        borderLeftColor: 'white.0',
                                        borderLeftStyle: 'dashed',
                                        borderLeftWidth: sizeConverter(1),
                                        ml: sizeConverter(11.5, 'spaceX'),
                                    }),
                            }}
                        >
                            <TreeWrapperItem
                                data={item}
                                isFullWidth={isFullWidth}
                                selected={selected}
                                expanded={expanded}
                                setExpanded={setExpanded}
                                setSelected={setSelected}
                                childrenSink={childrenSink}
                                treeStyle={treeStyle}
                                showPictureUrlOrIcon={showPictureUrlOrIcon}
                                valueKey={valueKey}
                                titleKey={titleKey}
                                pictureKey={pictureKey}
                                searchKey={searchKey}
                                isSearchParams={isSearchParams}
                                searchFilter={searchFilter}
                            />
                        </Grid>
                    )
                })}
        </>
    )
}

export default memo(TreeWrapperItem, areEqual)
