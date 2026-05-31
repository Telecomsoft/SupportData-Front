import DataGridIconProvider from '@components/general/telecomDataGrid/components/DataGridIconProvider.tsx'
import Grid from '@mui/material/Grid2'
import { FC, useState } from 'react'
import SelectAllIcon from '@mui/icons-material/SelectAll'
import HowToRegRoundedIcon from '@mui/icons-material/HowToRegRounded'
import { sizeConverter } from '@src/utility/sizeConverter'
import DeselectIcon from '@mui/icons-material/Deselect'

interface CustomBarProps {
    toolbarProps: {
        openDialog: () => void
        action: () => void
        selectAll: () => void
        deselectAll: () => void
    }
}

const CustomBar: FC<CustomBarProps> = ({ toolbarProps }) => {
    const [allSelected, setAllSelected] = useState(false)

    const handleSelectAllToggle = () => {
        if (allSelected) {
            toolbarProps.deselectAll()
        } else {
            toolbarProps.selectAll()
        }
        setAllSelected(!allSelected)
    }

    return (
        <Grid container size={12} justifyContent={'end'}>
            <DataGridIconProvider
                toolTipText={allSelected ? 'عدم انتخاب همه' : 'انتخاب همه'}
                Icon={allSelected ? DeselectIcon : SelectAllIcon}
                clickFunc={handleSelectAllToggle}
                extraStyle={{
                    ml: sizeConverter(3, 'spaceX'),
                }}
            />

            <DataGridIconProvider
                Icon={HowToRegRoundedIcon}
                clickFunc={toolbarProps?.openDialog}
                toolTipText="تخصیص"
                extraStyle={{
                    ml: sizeConverter(3, 'spaceX'),
                }}
            />
        </Grid>
    )
}

export default CustomBar
