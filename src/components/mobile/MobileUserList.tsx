// src/components/mobile/MobileUserList.tsx
import React from 'react';
import { Box, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { sizeConverter } from '@utility/sizeConverter';
import UserMobileCard from './UserMobileCard';

interface MobileUserListProps {
    users: any[];
    roles: any[];
    hasAccess: boolean;
    onAction: (actionType: string, user: any) => void;
    onAddClick: () => void;
}

export const MobileUserList: React.FC<MobileUserListProps> = ({
    users,
    roles,
    hasAccess,
    onAction,
    onAddClick
}) => {
    return (
        <Box sx={{ p: 2, pb: 10, width: '100%', position: 'relative' }}>
            {users?.map((user) => {
                const roleName = roles?.find(r => r.id === user.roleID)?.name;
                return (
                    <UserMobileCard
                        key={user.id}
                        user={user}
                        roleName={roleName}
                        hasAccess={hasAccess}
                        onAction={onAction}
                    />
                );
            })}

            {hasAccess && (
                <Fab 
                    color="primary" 
                    aria-label="add" 
                    onClick={onAddClick}
                    sx={{ 
                        position: 'fixed', 
                        bottom: sizeConverter(80, 'spaceY'), 
                        right: sizeConverter(16, 'spaceX'),
                        zIndex: 1000
                    }}
                >
                    <AddIcon />
                </Fab>
            )}
        </Box>
    );
};
