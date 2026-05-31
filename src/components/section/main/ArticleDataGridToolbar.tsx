import Grid from '@mui/material/Grid2'
import { sizeConverter } from '@src/utility/sizeConverter'
import AddIcon from '@mui/icons-material/Add'
import DataGridIconProvider from '@components/general/telecomDataGrid/components/DataGridIconProvider.tsx'
import { useState } from 'react'
import MenuList from '@components/general/menuList/MenuList'

// type Props = {}

const ArticleDataGridToolbar = ({ toolbarProps }: any) => {
   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

   const {  addGroupsArray } = toolbarProps

   const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget)
   }

   return (
      <>
         <Grid container size={'auto'} spacing={sizeConverter(4, 'spaceX')}>
            <DataGridIconProvider
               toolTipText={'اضافه'}
               Icon={AddIcon}
               disable={false}
               clickFunc={(event) => handleMenuClick(event as any)}
            />
            {/* <DataGridIconProvider toolTipText={'ویرایش'} Icon={EditIcon} disable={!selectedValue} clickFunc={editItem} />
            <DataGridIconProvider toolTipText={'حذف'} Icon={DeleteIcon} disable={!selectedValue} clickFunc={deleteItem} /> */}
         </Grid>
         <MenuList anchorEl={anchorEl} arrayData={addGroupsArray} open={!!anchorEl} handleClose={() => setAnchorEl(null)} />
      </>
   )
}

export default ArticleDataGridToolbar
