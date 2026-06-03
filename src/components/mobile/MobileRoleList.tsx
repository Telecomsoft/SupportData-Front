import { Box, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RoleItemCard from './RoleItemCard';

type MobileRoleListProps = {
    permissionRoles: any;
    setSelectedItem: (item: any) => void;
    setOpenDialog: (func: (prev: any) => any) => void;
    isAcceess: boolean;
};

export default function MobileRoleList({
    permissionRoles,
    setSelectedItem,
    setOpenDialog,
    isAcceess
}: MobileRoleListProps) {
    return (
        <Box sx={{ width: '100%', p: 2, pb: 10, overflowY: 'auto' }}>
            {permissionRoles.data?.value.map((role) => (
                <RoleItemCard
                    key={role.id}
                    name={role.name}
                    onClick={() => setSelectedItem(role)} // اینجا به صفحه دسترسی‌ها می‌رود
                    onEdit={() => {
                        setSelectedItem(role);
                        setOpenDialog((prev) => ({ ...prev, roleAdd: 'edit' }));
                    }} // اینجا فقط دیالوگ ویرایش باز می‌شود
                    onDelete={() => {
                        setSelectedItem(role);
                        setOpenDialog((prev) => ({ ...prev, roleDelete: 'delete' }));
                    }} // اینجا فقط دیالوگ حذف باز می‌شود
                    onRoleAdd={() => {
                        setOpenDialog((prev) => ({ ...prev, roleMobile: 'add' }));
                    }}
                />
            ))}

            {/* دکمه شناور افزودن نقش */}
            {isAcceess && (
                <Fab
                    color="primary"
                    sx={{ position: 'fixed', bottom: 70, right: 16, zIndex: 10 }}
                    onClick={() => setOpenDialog((prev: any) => ({ ...prev, roleAdd: 'add' }))}
                >
                    <AddIcon />
                </Fab>
            )}
        </Box>
    );
}
