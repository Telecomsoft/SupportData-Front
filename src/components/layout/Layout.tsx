import SideBarLayout from './SidebarLayout'
import Grid from '@mui/material/Grid2'
import { ReactNode, useState } from 'react'
import { sizeConverter } from '@utility/sizeConverter'
import LayoutTopHeader from '@components/layout/LayoutTopHeader'

type LayoutProps = {
    children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
    const [isOpen, setIsOpen] = useState<boolean>(true)

    return (
        <Grid container justifyContent={'space-between'} sx={{ height: '100vh', overflow: 'hidden' }}>
            <Grid container size={isOpen ? 2.1 : 0.6} sx={{ transition: 'all 0.2s ease-in-out'}}>
                <SideBarLayout setIsOpen={setIsOpen} isOpen={isOpen} />
            </Grid>
            <Grid
                container
                size={isOpen ? 9.9 : 11.4}
                alignContent={'flex-start'}
                alignItems={'center'}
                justifyContent={'center'}
                sx={{
                    transition: 'all 0.2s ease-in-out',
                    bgcolor: 'primary.main',
                }}
            >
                <Grid
                    container
                    size={12}
                    alignContent={'flex-start'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    sx={{
                        borderTopLeftRadius: sizeConverter(100, 'radius'),
                        borderLeftColor: 'primary.main',
                        borderLeftStyle: 'solid',
                        borderLeftWidth: sizeConverter(1),
                        bgcolor: 'bgColor.2',
                        height: '100vh',
                    }}
                >
                    <LayoutTopHeader />
                    <Grid
                        container
                        size={12}
                        justifyContent={'flex-start'}
                        sx={{ height: '92%', overflow: 'auto', p: sizeConverter(10, 'space') }}
                    >
                        {children}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}
