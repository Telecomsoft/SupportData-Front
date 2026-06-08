import React from 'react';
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
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';
import { TransitionProps } from '@mui/material/transitions';
import SecurityIcon from '@mui/icons-material/Security';

import SelectAllIcon from '@mui/icons-material/SelectAll';
import CircleIcon from '@mui/icons-material/Circle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

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
  onSelectAll: (select: boolean) => void;
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

  const allSelected = permissions.length > 0 && permissions.every(
    (perm) => perm.readAccess === true && perm.writeAccess === true
  );

  const handleSelectAllClick = () => {
    onSelectAll(!allSelected);
  };

  return (
    <Dialog
      fullScreen
      sx={{ paddingTop: 10 }}
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      PaperProps={{
        style: {
          backgroundColor: theme.palette.bgColor[1],
        },
      }}
    >
      {/* پدینگ بالا و پایین اضافه شد تا محتوا با لبه‌ها و دکمه‌های پایین تداخل نداشته باشد */}
      <Container sx={{ p: 2, pt: 4, pb: 12 }}>
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

        <Grid container justifyContent={'space-between'} alignItems={'center'} mb={1}>
          <Typography variant="overline" sx={{ px: 1, fontWeight: 'bold', color: theme.palette.black[4] }}>
            لیست ماژول‌ها
          </Typography>
          <Grid container onClick={handleSelectAllClick} alignItems={'center'} sx={{ cursor: 'pointer' }}>
            <SelectAllIcon sx={{ color: theme.palette.black[4] }} />
            <Typography variant="overline" sx={{ px: 1, fontWeight: 'bold', color: theme.palette.black[4] }}>
              انتخاب همه
            </Typography>
          </Grid>
        </Grid>

        <Card sx={{ mb: 2, borderRadius: 3, overflow: 'hidden' , boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <Box sx={{ display: 'flex', px: 2, py: 1.5, bgcolor: theme.palette.primary.main, color: theme.palette.white[0] }}>
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

      {/* بخش ثابت پایین با دو دکمه بروزرسانی و بستن */}
      <Box sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        p: 2,
        pb: 8,
        bgcolor: theme.palette.white[0],
        boxShadow: '0 -4px 10px rgba(0,0,0,0.05)',
        display: 'flex',
        gap: 2,
        zIndex: 10
      }}>
        <Button
          fullWidth
          variant="confirmMobile"
          color="primary"
          onClick={onSave}
          sx={{ py: 1.5, fontSize: '1rem', fontWeight: 'bold', borderRadius: 3 }}
        >
          بروزرسانی
        </Button>
        <Button
          fullWidth
          variant="cancelMobile"
          onClick={onClose}
          sx={{
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 'bold',
            borderRadius: 3,
            color: theme.palette.black[2],
            borderColor: theme.palette.black[4]
          }}
        >
          بستن
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
