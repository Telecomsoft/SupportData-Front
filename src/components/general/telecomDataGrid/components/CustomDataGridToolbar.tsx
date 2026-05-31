import Grid from '@mui/material/Grid2'
import IconProvider from '@components/general/IconProvider.tsx'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import { SvgIconComponent } from '@mui/icons-material'
import { sizeConverter } from '@utility/sizeConverter.ts'
import { Dispatch, SetStateAction } from 'react'
import Skeleton from '@mui/material/Skeleton'
import FolderCopyIcon from "@mui/icons-material/FolderCopy";

type iconObjType = {
    icon: SvgIconComponent
    value: string
    disable?: boolean
    action: 'edit' | 'add'
    sidebarKey: string
    toolTipText: string
}
const CustomDataGridToolbar = ({
    toolbarProps,
}: {
    toolbarProps: {
        sidebarTitle: string
        toolbarArray?: string[]
        loading?: boolean
        toolbarEditException?: boolean
        selectRow?: any
        setOpenDialog?: Dispatch<SetStateAction<Record<string, 'add' | 'edit' | null>>>
    }
}) => {
    const iconArray: iconObjType[] = [
        {
            icon: DeleteIcon,
            value: 'delete',
            action: 'edit',
            sidebarKey: 'delete',
            disable: !toolbarProps?.selectRow?.length,
            toolTipText: 'حذف',
        },
        {
            icon: EditIcon,
            value: 'edit',
            action: 'edit',
            sidebarKey: 'add',
            disable: !toolbarProps?.selectRow?.length,
            toolTipText: 'ویرایش',
        },
        { icon: AddIcon, value: 'add', sidebarKey: 'add', action: 'add', toolTipText: 'افزودن' },
        { icon: FolderCopyIcon, value: 'copy', sidebarKey: 'copy', action: 'add', toolTipText: 'رونوشت' },
    ]

    const handleClickOpenDialog = (key: string, action: 'edit' | 'add') => {
        toolbarProps?.setOpenDialog?.((prev: Record<string, 'add' | 'edit' | null>) => {
            return {
                ...prev,
                [toolbarProps?.sidebarTitle + key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()]: action,
            }
        })
    }

    return (
        <Grid container size={12} justifyContent={'flex-end'}>
            <Grid container alignItems={'center'} columnGap={sizeConverter(1, 'spaceX')}>
                {iconArray
                    .filter((fData: iconObjType) => toolbarProps?.toolbarArray?.includes(fData.value))
                    .map((item: iconObjType) => {
                        if (!toolbarProps?.loading)
                            return (
                                <IconProvider
                                    key={item.value}
                                    Icon={item.icon}
                                    clickFunc={() => handleClickOpenDialog(item.sidebarKey, item.action)}
                                    disable={item.disable}
                                    toolTipText={item.toolTipText}
                                />
                            )
                        else
                            return (
                                <Skeleton
                                    variant="rectangular"
                                    sx={{
                                        m: sizeConverter(1, 'space'),
                                        borderRadius: sizeConverter(3, 'radius'),
                                        height: sizeConverter(15),
                                        width: sizeConverter(15),
                                    }}
                                />
                            )
                    })}
            </Grid>
        </Grid>
    )
}

export default CustomDataGridToolbar
