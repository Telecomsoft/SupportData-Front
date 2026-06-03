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
  Container
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import SecurityIcon from '@mui/icons-material/Security';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

// انیمیشن ورود از پایین (Slide Up)
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
};

const mainColor = '#7a0016';
const bgColor = '#f8f9fa';

export default function MobilePermissionDialog({
  open,
  selectedRole,
  permissions,
  onClose,
  onSave,
  onPermissionChange
}: MobilePermissionDialogProps) {
  
  if (!selectedRole) return null;

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      sx={{ '& .MuiDialog-paper': { bgcolor: bgColor } }}
    >
      {/* هدر ثابت بالا */}
      <AppBar sx={{ position: 'relative', bgcolor: mainColor, elevation: 0 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1, fontWeight: 'bold' }} variant="h6" component="div">
             تنظیم دسترسی: {selectedRole.name}
          </Typography>
          <Button autoFocus color="inherit" onClick={onSave} sx={{ fontWeight: 'bold' }}>
            ذخیره
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ p: 2, pb: 12 }}>
        {/* اطلاعات کلی نقش */}
        <Card sx={{ mb: 2, borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', py: '12px !important' }}>
            <AvatarIcon />
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle1" fontWeight="800">{selectedRole.name}</Typography>
              <Typography variant="caption" color="text.secondary">{selectedRole.description || 'بدون توضیحات'}</Typography>
            </Box>
          </CardContent>
        </Card>

        {/* لیست دسترسی‌ها */}
        <Typography variant="overline" sx={{ px: 1, fontWeight: 'bold', color: 'text.secondary' }}>لیست ماژول‌ها</Typography>
        <Card sx={{ mb: 2, borderRadius: 3, overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', px: 2, py: 1.5, bgcolor: '#f1f1f1' }}>
              <Typography variant="caption" fontWeight="bold" sx={{ flexGrow: 1 }}>ماژول</Typography>
              <Typography variant="caption" fontWeight="bold" sx={{ width: 50, textAlign: 'center' }}>خواندن</Typography>
              <Typography variant="caption" fontWeight="bold" sx={{ width: 50, textAlign: 'center' }}>نوشتن</Typography>
            </Box>

            {permissions?.map((perm, index) => (
              <React.Fragment key={perm.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" fontWeight="700">{perm.name}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        دسترسی به بخش {perm.name}
                    </Typography>
                  </Box>
                  
                  <Checkbox 
                    checked={perm.readAccess || perm.read}
                    onChange={(e) => onPermissionChange(perm, 'readAccess', e.target.checked)}
                    icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                    checkedIcon={<CheckBoxIcon fontSize="small" sx={{ color: mainColor }} />}
                  />
                  
                  <Checkbox 
                    checked={perm.writeAccess || perm.write}
                    onChange={(e) => onPermissionChange(perm, 'writeAccess', e.target.checked)}
                    icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                    checkedIcon={<CheckBoxIcon fontSize="small" sx={{ color: mainColor }} />}
                  />
                </Box>
                {index < permissions.length - 1 && <Divider variant="middle" />}
              </React.Fragment>
            ))}
        </Card>

        {/* راهنما */}
        <Box sx={{ p: 1, opacity: 0.7 }}>
             <Stack direction="row" spacing={2} justifyContent="center">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckBoxIcon sx={{ color: mainColor, fontSize: 16, mr: 0.5 }} />
                    <Typography variant="caption">دارای دسترسی</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckBoxOutlineBlankIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="caption">عدم دسترسی</Typography>
                </Box>
             </Stack>
        </Box>
      </Container>

      {/* دکمه ذخیره چسبان در پایین (Floating Bottom Bar) */}
      <Box sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        p: 2, 
        bgcolor: 'rgba(255,255,255,0.9)', 
        backdropFilter: 'blur(8px)',
        borderTop: '1px solid #eee' 
      }}>
        <Button 
          variant="contained" 
          fullWidth 
          onClick={onSave}
          sx={{ bgcolor: mainColor, py: 1.5, borderRadius: 3, fontWeight: 'bold' }}
        >
          بروزرسانی دسترسی‌ها
        </Button>
      </Box>
    </Dialog>
  );
}

function AvatarIcon() {
    return (
        <Box sx={{ bgcolor: '#eee', p: 1, borderRadius: 2, display: 'flex' }}>
            <SecurityIcon sx={{ color: '#555' }} />
        </Box>
    );
}
