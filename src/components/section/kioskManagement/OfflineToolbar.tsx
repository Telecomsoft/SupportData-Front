import { FC } from 'react'
import Grid from '@mui/material/Grid2'
import DataGridIconProvider from '@components/general/telecomDataGrid/components/DataGridIconProvider';
import { sizeConverter } from '@src/utility/sizeConverter';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
// import DeleteSweepRoundedIcon from '@mui/icons-material/DeleteSweepRounded';

interface OfflineToolbarProps {
  selectedRows:Set<number>
  toolbarProps: {
    deleteWithIds: () => void
    // deleteAll: () => void
}
}

const OfflineToolbar: FC<OfflineToolbarProps> = ({selectedRows ,toolbarProps}) => {
  // console.log(selectedRows);

  const handleClickDeleteWithIds=()=>{
    toolbarProps.deleteWithIds()
  }
  
  return  <Grid container size={12} justifyContent={'end'}>
  <DataGridIconProvider
      toolTipText={'حذف'}
      disable={selectedRows?.size===0}
      Icon={DeleteRoundedIcon}
      clickFunc={handleClickDeleteWithIds}
      extraStyle={{
          ml: sizeConverter(3, 'spaceX'),
      }}
  />

</Grid>
}

export default OfflineToolbar