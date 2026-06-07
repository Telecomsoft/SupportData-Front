import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Checkbox,
  Stack,
  Divider,
  AppBar,
  Toolbar,
  Dialog,
  Slide,
  Container,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import SecurityIcon from '@mui/icons-material/Security';

import SelectAllIcon from '@mui/icons-material/SelectAll'; // آیکون انتخاب همه
import CircleIcon from '@mui/icons-material/Circle'

import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export type MobilePermissionDialogProps = {
  open: boolean;
  selectedRole: any | null;
  permissions: any[];
  onClose: () => void;
  onSave: () => void;
  onPermissionChange: (moduleId: string, type: 'read' | 'write', value: boolean) => void;
  onSelectAll: (select: boolean) => void; // جدید: تابع انتخاب همه از والد
};

export default function MobilePermissionDialog({
  open,
  selectedRole,
  permissions,
  onClose,
  onSave,
  onPermissionChange,
  onSelectAll
}: MobilePermissionDialogProps) {
  const theme = useTheme();

  if (!selectedRole) return null;

  // بررسی می‌کند که آیا همه دسترسی‌ها (خواندن و نوشتن) برای همه ماژول‌ها فعال است
  const allSelected = permissions.length > 0 && permissions.every(
    (perm) => perm.readAccess === true && perm.writeAccess === true
  );

  const handleSelectAllClick = () => {
    onSelectAll(!allSelected);
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}

    >
      <AppBar sx={{ position: 'relative', bgcolor: theme.palette.primary.main, elevation: 0 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1, fontWeight: 'bold' }} variant="h6" component="div">
            تنظیم دسترسی: {selectedRole.name}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ p: 2, pb: 12 }}>
        <Card sx={{ mb: 2, borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', py: '12px !important' }}>
            <AvatarIcon theme={theme} />
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle1" fontWeight="800">{selectedRole.name}</Typography>
              <Typography variant="body2" color={theme.palette.black[4]}>
                {selectedRole.description || 'بدون توضیحات'}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Grid container justifyContent={'space-between'} alignItems={'center'}>
          <Typography variant="overline" sx={{ px: 1, fontWeight: 'bold', color: theme.palette.black[4] }}>
            لیست ماژول‌ها
          </Typography>
          {/* دکمه انتخاب همه */}
          <Grid container onClick={handleSelectAllClick} alignItems={'center'}>
            <IconButton color="inherit" aria-label="select all">
              <SelectAllIcon />
            </IconButton>
            <Typography variant="overline" sx={{ px: 1, fontWeight: 'bold', color: theme.palette.black[4] }}>
              انتخاب همه
            </Typography>
          </Grid>
        </Grid>
        <Card sx={{ mb: 2, borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', px: 2, py: 1.5, bgcolor: theme.palette.primary.main, color: theme.palette.white[0], fontsize: 15 }}>
            <Typography variant="body2" fontWeight="bold" sx={{ textAlign: 'center', flexGrow: 1 }}>ماژول</Typography>
            <Typography variant="body2" fontWeight="bold" sx={{ width: 70, textAlign: 'center' }}>خواندن</Typography>
            <Typography variant="body2" fontWeight="bold" sx={{ width: 70, textAlign: 'center' }}>نوشتن</Typography>
          </Box>

          {permissions?.map((perm, index) => (
            <React.Fragment key={perm.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body1" fontWeight="700">{perm.name}</Typography>
                </Box>

                <Checkbox sx={{ px: 3 }}
                  checked={perm.readAccess || perm.read}
                  onChange={(e) => onPermissionChange(perm, 'readAccess', e.target.checked)}
                  icon={<CircleIcon fontSize="medium" sx={{ color: theme.palette.black[5] }} />}
                  checkedIcon={<CheckCircleIcon fontSize="medium" sx={{ color: theme.palette.primary.main }} />}
                />

                <Checkbox sx={{ px: 3 }}
                  checked={perm.writeAccess || perm.write}
                  onChange={(e) => onPermissionChange(perm, 'writeAccess', e.target.checked)}
                  icon={<CircleIcon fontSize="medium" sx={{ color: theme.palette.black[5] }} />}
                  checkedIcon={<CheckCircleIcon fontSize="medium" sx={{ color: theme.palette.primary.main }} />}
                />
              </Box>
              {index < permissions.length - 1 && <Divider variant="middle" />}
            </React.Fragment>
          ))}
        </Card>
      </Container>

      <Box sx={{
        position: 'fixed',
        bottom: 50,
        left: 0,
        right: 0,
        p: 2,
        backgroundColor: `${theme.palette.white[0]}E6`,
        backdropFilter: 'blur(8px)',
        borderTop: `1px solid ${theme.palette.black[6]}`
      }}>
        <Button
          variant="contained"
          fullWidth
          onClick={onSave}
          sx={{ bgcolor: theme.palette.primary.main, py: 1.5, borderRadius: 3, fontWeight: 'bold' }}
        >
          بروزرسانی دسترسی‌ها
        </Button>
      </Box>
    </Dialog>
  );
}

function AvatarIcon({ theme }: { theme: any }) {
  return (
    <Box sx={{ bgcolor: theme.palette.bgColor[3], p: 1, borderRadius: 2, display: 'flex' }}>
      <SecurityIcon sx={{ color: theme.palette.black[4] }} />
    </Box>
  );
}