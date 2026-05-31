/* eslint-disable */
//@ts-nocheck

import Checkbox from '@mui/material/Checkbox'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded'
import PanoramaFishEyeRoundedIcon from '@mui/icons-material/PanoramaFishEyeRounded'
import { sizeConverter } from '@utility/sizeConverter.ts'

type DataGridCheckboxProps = {
    checked: boolean
    onClick?: () => void
    isHeader?: boolean
    sx?: Record<string, string | number>
    icon?: any
    disabled?: boolean
}
const DataGridCheckbox = ({ checked, onClick, isHeader,icon,disabled, sx }: DataGridCheckboxProps) => {
    return (
        <Checkbox
            sx={{ ...sx }}
            checked={checked}
            onClick={onClick}
            disabled={disabled}
            icon={icon ? icon : <PanoramaFishEyeRoundedIcon sx={{ width: sizeConverter(20), height: sizeConverter(20) }} />}
            checkedIcon={
                isHeader ? (
                    <RemoveCircleRoundedIcon sx={{ color: 'dataGrid.main', width: sizeConverter(20), height: sizeConverter(20) }} />
                ) : (
                    <CheckCircleRoundedIcon sx={{ color: 'dataGrid.main', width: sizeConverter(20), height: sizeConverter(20) }} />
                )
            }
        />
    )
}

export default DataGridCheckbox
