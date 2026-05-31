import React from 'react'
import { List, ListItem, IconButton, Typography, Box, ListItemText } from '@mui/material'
import { AddCircleOutline, CheckCircle } from '@mui/icons-material'
import { sizeConverter } from '@src/utility/sizeConverter'

interface UpdateInfo {
   id: number
   updateName: string
   version: string
   setDate: string
   effectDate: string
   fileURL: string
   remark: string | null
   assignToAllKiosks: boolean
   kioskSerials: string[] | null
   isActive: boolean
   preRequiredVersion: string | null
   fileSign: string
   kioskSerial: string
   kioskName: string
}

interface AssignUpdateListProps {
   updates: UpdateInfo[]
   onAssign: (update: UpdateInfo) => void
}

const AssignUpdateList: React.FC<AssignUpdateListProps> = ({ updates, onAssign }) => {
   return (
      <Box
         sx={{
            p: 2,
            width: 350,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            bgcolor: '#f9f9f9',
            borderRadius: 2,
         }}
      >
         <Typography variant="h6">Assign To Updates</Typography>

         <List dense sx={{ height: sizeConverter(580, 'height'), overflowY: 'auto' }}>
            {updates?.map((update) => (
               <ListItem
                  key={update?.id}
                  secondaryAction={
                     <IconButton edge="end" onClick={() => onAssign(update)} color={update?.assignToAllKiosks ? 'success' : 'primary'}>
                        {update?.assignToAllKiosks ? <CheckCircle /> : <AddCircleOutline />}
                     </IconButton>
                  }
               >
                  <ListItemText primary={`${update?.kioskName} (${update?.kioskSerial})`} />
               </ListItem>
            ))}
         </List>
      </Box>
   )
}

export default AssignUpdateList
