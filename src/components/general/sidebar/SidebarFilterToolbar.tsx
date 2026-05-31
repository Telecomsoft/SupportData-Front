import Skeleton from '@mui/material/Skeleton'
import { sizeConverter } from '@utility/sizeConverter.ts'
import Grid from '@mui/material/Grid2'
import StyledTextField from '@components/general/input/StyledTextField.tsx'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import StraightRoundedIcon from '@mui/icons-material/StraightRounded'
import {ChangeEvent, Dispatch, SetStateAction} from "react";
import {handleRequestWithDelay} from "@utility/handleRequestWithDelay.ts";

const SidebarFilterToolbar = ({
    loading,
    sort,
    searchConfig,
    searchField,
                                  setSearchFilter
}: {
    loading?: boolean
    sort?: boolean
    searchConfig?: boolean
    searchField?: boolean
    setSearchFilter?: Dispatch<SetStateAction<string| null>>
}) => {
    return (
        <Grid container justifyContent={'center'} alignItems={'center'} alignContent={'center'} size={12}>
            {loading ? (
                <Grid container justifyContent={'space-between'} alignItems={'center'} size={12}>
                    {searchField && (
                        <Skeleton
                            height={sizeConverter(26, 'height')}
                            width={!sort && !searchConfig ? '100%' : !sort || !searchConfig ? '87%' : '77%'}
                        />
                    )}
                    {sort && <Skeleton height={sizeConverter(26, 'height')} width={'10%'} />}
                    {searchConfig && <Skeleton height={sizeConverter(26, 'height')} width={'10%'} />}
                </Grid>
            ) : (
                <Grid container justifyContent={'space-between'} alignItems={'center'} size={12}>
                    {searchField && (
                        <Grid container justifyContent={'space-between'} alignItems={'center'} size="grow">
                            <StyledTextField
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    setSearchFilter ? handleRequestWithDelay(() => setSearchFilter(e?.target?.value)) : undefined
                                }}
                                placeholder={'جستجو'}
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
                    )}

                    {searchConfig && (
                        <TuneRoundedIcon
                            sx={{
                                width: sizeConverter(24),
                                height: sizeConverter(24),
                                // color: searchConfig === null || isEmpty(searchConfig) ? 'fontColor.0' : 'yellow.0',
                                color: 'black.0',
                                borderRadius: sizeConverter(5, 'radius'),
                                borderWidth: sizeConverter(1),
                                borderStyle: 'solid',
                                // borderColor: searchConfig === null || isEmpty(searchConfig) ? 'fontColor.0' : 'yellow.0',
                                borderColor: 'black.0',
                                ml: sizeConverter(5, 'spaceX'),
                                mr: sizeConverter(1, 'spaceX'),
                                cursor: 'pointer',
                                transition: '0.2s ease-in-out',
                                '&:hover': {
                                    color: 'yellow.0',
                                    borderColor: 'yellow.0',
                                },
                            }}
                        />
                    )}
                    {sort && (
                        <StraightRoundedIcon
                            sx={{
                                width: sizeConverter(24),
                                height: sizeConverter(24),
                                // color: searchConfig === null || isEmpty(searchConfig) ? 'fontColor.0' : 'yellow.0',
                                color: 'black.0',
                                borderRadius: sizeConverter(5, 'radius'),
                                borderWidth: sizeConverter(1),
                                borderStyle: 'solid',
                                // borderColor: searchConfig === null || isEmpty(searchConfig) ? 'fontColor.0' : 'yellow.0',
                                borderColor: 'black.0',
                                rotate: '180deg',
                                opacity: 0.6,
                                ml: sizeConverter(5, 'spaceX'),
                                mr: sizeConverter(1, 'spaceX'),
                                cursor: 'pointer',
                                transition: '0.2s ease-in-out',
                                '&:hover': {
                                    color: 'yellow.0',
                                    borderColor: 'yellow.0',
                                },
                            }}
                        />
                    )}
                </Grid>
            )}
        </Grid>
    )
}

export default SidebarFilterToolbar
