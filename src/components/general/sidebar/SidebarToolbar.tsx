import Grid from '@mui/material/Grid2'
import IconProvider from '@components/general/IconProvider.tsx'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import LockResetRoundedIcon from '@mui/icons-material/LockResetRounded';
import { SvgIconComponent } from '@mui/icons-material'
import { sizeConverter } from '@utility/sizeConverter.ts'
import { Dispatch, SetStateAction } from 'react'
import Skeleton from '@mui/material/Skeleton'
import FolderCopyIcon from '@mui/icons-material/FolderCopy'
import PasswordRoundedIcon from '@mui/icons-material/PasswordRounded'

type iconObjType = {
    icon: SvgIconComponent
    value: string
    disable?: boolean
    action: 'edit' | 'add'
    sidebarKey: string
    toolTipText: string
}
const SidebarToolbar = ({
    sidebarTitle,
    toolbarArray,
    selectedItem,
    setOpenDialog,
    loading,
    toolbarEditException,
}: {
    sidebarTitle: string
    toolbarArray?: string[]
    loading?: boolean
    toolbarEditException?: boolean
    selectedItem?: unknown
    setOpenDialog?: Dispatch<SetStateAction<Record<string, 'add' | 'edit' | null>>>

}) => {

    const iconArray: iconObjType[] = [
        {
            icon: DeleteIcon,
            value: 'delete',
            action: 'edit',
            sidebarKey: 'delete',
            disable: !selectedItem && !toolbarEditException,
            toolTipText: 'حذف',
        },
        {
            icon: EditIcon,
            value: 'edit',
            action: 'edit',
            sidebarKey: 'add',
            disable: !selectedItem && !toolbarEditException,
            toolTipText: 'ویرایش',
        },
        { icon: AddIcon, value: 'add', sidebarKey: 'add', action: 'add', toolTipText: 'افزودن' },
        { icon: FolderCopyIcon, value: 'copy', sidebarKey: 'copy', action: 'add', toolTipText: 'رونوشت' },
        {
            icon: PasswordRoundedIcon,
            value: 'assign',
            sidebarKey: 'assign',
            action: 'edit',
            toolTipText: 'تنظیم رمز عبور',
        },
        {
            icon: LockResetRoundedIcon,
            value: 'reset',
            sidebarKey: 'reset',
            action: 'edit',
            toolTipText: 'بازنشانی رمز عبور',
        },
    ]

    const handleClickOpenDialog = (key: string, action: 'edit' | 'add') => {
        setOpenDialog?.((prev) => ({
            ...prev,
            [sidebarTitle + key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()]: action,
        }))
    }

    return (
        <Grid container justifyContent={'flex-end'} alignItems={'center'} size="auto" columnGap={sizeConverter(1, 'spaceX')}>
            {iconArray
                .filter((fData: iconObjType) => toolbarArray?.includes(fData.value))
                .map((item: iconObjType) => {
                    if (!loading)
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
    )
}

export default SidebarToolbar
