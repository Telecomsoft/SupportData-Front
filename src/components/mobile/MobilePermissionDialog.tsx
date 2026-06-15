import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Checkbox,
  Divider,
  Dialog,
  Slide,
  Container,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useTheme } from '@mui/material/styles'
import { TransitionProps } from '@mui/material/transitions'
import SecurityIcon from '@mui/icons-material/Security'
import SelectAllIcon from '@mui/icons-material/SelectAll'
import DeselectIcon from '@mui/icons-material/Deselect'
import CircleIcon from '@mui/icons-material/Circle'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})
type Permission = {
  id: number
  name: string
  readAccess: boolean
  writeAccess: boolean
}
export type MobilePermissionDialogProps = {
  open: boolean
  selectedRole: any | null
  permissions: Permission[]
  onClose: () => void
  onSave: () => void

  onPermissionChange: (
    role: Permission,
    accessType: 'readAccess' | 'writeAccess',
    value: boolean
  ) => void

  onSelectAll: (select: boolean) => void
}

export default function MobilePermissionDialog({
  open,
  selectedRole,
  permissions,
  onClose,
  onSave,
  onPermissionChange,
  onSelectAll,
}: MobilePermissionDialogProps) {
  const theme = useTheme()

  if (!selectedRole) return null

  const allSelected =
    permissions.length > 0 &&
    permissions.every(
      (perm) =>
        (perm.readAccess ?? perm.readAccess) === true &&
        (perm.writeAccess ?? perm.writeAccess) === true,
    )

  const handleSelectAllClick = () => {
    onSelectAll(!allSelected)
  }

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: theme.palette.bgColor[1],
          pt: 12
        },
      }}
    >
      <Container
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          p: 2,
          pt: 4,
        }}
      >
        <Card
          sx={{
            height: 'auto', // تغییر از 100 به حالت داینامیک
            minHeight: 80,  // یک حداقل ارتفاع منطقی برای حفظ زیبایی
            mb: 2,
            borderRadius: 3,
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center' // تراز عمودی محتوا در صورت بزرگ شدن کارت
          }}
        >
          <CardContent
            sx={{
              display: 'flex',
              alignItems: 'center', // تراز شدن آیکون و متون با هم
              width: '100%',
              py: '16px !important', // پدینگ عمودی استاندارد و منعطف
              px: 2
            }}
          >
            <AvatarIcon theme={theme} />
            <Box sx={{ ml: 2, flex: 1 }}>
              <Typography variant="subtitle1" fontWeight="800" sx={{ lineHeight: 1.3 }}>
                {selectedRole.name}
              </Typography>
              <Typography
                variant="body2"
                color={theme.palette.black[4]}
                sx={{ mt: 0.5, wordBreak: 'break-word' }} // شکستن کلمات طولانی در صورت نیاز
              >
                {selectedRole.description || 'بدون توضیحات'}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Grid container justifyContent={'space-between'} alignItems={'center'} mb={1}>
          <Typography
            variant="overline"
            sx={{ px: 1, fontWeight: 'bold', color: theme.palette.black[4] }}
          >
            لیست ماژول‌ها
          </Typography>

          <Grid
            container
            onClick={handleSelectAllClick}
            alignItems={'center'}
            sx={{ cursor: 'pointer' }}
          >
            {!allSelected ?
              < SelectAllIcon sx={{ color: theme.palette.black[4] }} />
              :
              < DeselectIcon sx={{ color: theme.palette.black[4] }} />
            }
            <Typography
              variant="overline"
              sx={{ px: 1, fontWeight: 'bold', color: theme.palette.black[4] }}
            >
              انتخاب همه
            </Typography>
          </Grid>
        </Grid>

        <Card
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            // flex: 1,
            minHeight: 0,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              px: 2,
              py: 1.5,
              bgcolor: theme.palette.primary.main,
              color: theme.palette.white[0],
            }}
          >
            <Typography variant="body2" fontWeight="bold" sx={{ flexGrow: 1, textAlign: 'center' }}>
              ماژول
            </Typography>
            <Typography variant="body2" fontWeight="bold" sx={{ width: 70, textAlign: 'center' }}>
              خواندن
            </Typography>
            <Typography variant="body2" fontWeight="bold" sx={{ width: 70, textAlign: 'center' }}>
              نوشتن
            </Typography>
          </Box>

          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              minHeight: 0,
            }}
          >
            {permissions?.map((perm, index) => (
              <React.Fragment key={perm.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body1" fontWeight="700">
                      {perm.name}
                    </Typography>
                  </Box>

                  <Checkbox
                    sx={{ px: 3 }}
                    checked={perm.readAccess ?? perm.readAccess ?? false}
                    onChange={(e) =>
                      onPermissionChange(perm, 'readAccess', e.target.checked)
                    }
                    icon={
                      <CircleIcon
                        fontSize="medium"
                        sx={{ color: theme.palette.black[5] }}
                      />
                    }
                    checkedIcon={
                      <CheckCircleIcon
                        fontSize="medium"
                        sx={{ color: theme.palette.primary.main }}
                      />
                    }
                  />

                  <Checkbox
                    sx={{ px: 3 }}
                    checked={perm.writeAccess ?? perm.writeAccess ?? false}
                    onChange={(e) =>
                      onPermissionChange(perm, 'writeAccess', e.target.checked)
                    }
                    icon={
                      <CircleIcon
                        fontSize="medium"
                        sx={{ color: theme.palette.black[5] }}
                      />
                    }
                    checkedIcon={
                      <CheckCircleIcon
                        fontSize="medium"
                        sx={{ color: theme.palette.primary.main }}
                      />
                    }
                  />
                </Box>

                {index < permissions.length - 1 && <Divider variant="middle" />}
              </React.Fragment>
            ))}
          </Box>
        </Card>
      </Container>

      <Box
        sx={{
          p: 2,
          bgcolor: theme.palette.white[0],
          boxShadow: '0 -4px 10px rgba(0,0,0,0.05)',
          display: 'flex',
          gap: 2,
          pb: 10
        }}
      >
        <Button fullWidth variant="cancelMobile" onClick={onClose}>
          بستن
        </Button>

        <Button fullWidth variant="confirmMobile" color="primary" onClick={onSave}>
          بروزرسانی
        </Button>
      </Box>
    </Dialog>
  )
}

function AvatarIcon({ theme }: { theme: any }) {
  return (
    <Box
      sx={{
        bgcolor: theme.palette.bgColor[3],
        p: 1,
        borderRadius: 2,
        display: 'flex',
      }}
    >
      <SecurityIcon sx={{ color: theme.palette.black[4] }} />
    </Box>
  )
}
