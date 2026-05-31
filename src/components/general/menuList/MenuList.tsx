import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import MenuListMaterial from '@mui/material/MenuList'
import { sizeConverter } from '@src/utility/sizeConverter'

interface IMenuList {
    open: boolean
    anchorEl: any
    handleClose?: any
    arrayData: any[]
    oncloseButton?: any
    customHandleClick?: any
    passData?: any
}

const MenuList = ({ open, anchorEl, handleClose, arrayData, oncloseButton = undefined, customHandleClick, passData }: IMenuList) => {

    return (
        <Menu
            id={'basic-menu'}
            anchorEl={anchorEl}
            autoFocus={false}
            open={open}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            PaperProps={{
                style: {
                    overflow: 'hidden',
                    padding: sizeConverter(25, 'space'),
                    borderRadius: sizeConverter(25, 'radius'),
                    marginTop: sizeConverter(48, 'spaceY'),
                    borderWidth: sizeConverter(1),
                    borderStyle: 'solid',
                    // borderColor: theme.palette.border['main'],
                    boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
                },
            }}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}>
            {oncloseButton && <HighlightOffIcon onClick={oncloseButton} sx={{ fontSize: sizeConverter(18), hover: { color: 'red.0' } }} />}
            <MenuListMaterial>
                {arrayData?.map(item =>
                    <MenuItem
                        sx={{
                            fontSize: sizeConverter(12),
                        }}
                        key={item.value}
                        // disabled={item.disabled}
                        onClick={(event) => {
                            if (!customHandleClick) {
                                !!item.onClick && item.onClick(event)
                                !!passData && item.onClick(passData)
                                handleClose(event, item.key, item.value)
                            } else {
                                customHandleClick(item.value, handleClose())
                            }
                        }}>
                        {item.title}
                    </MenuItem>
                )}
            </MenuListMaterial>
        </Menu>
    )
}

export default MenuList
