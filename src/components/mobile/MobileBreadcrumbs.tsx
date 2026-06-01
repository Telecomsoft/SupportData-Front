import {
    Breadcrumbs,
    Typography,
    Link,
    Box,
} from '@mui/material'

import {
    useLocation,
    useNavigate,
} from '@tanstack/react-router'


import { getBreadcrumbs } from './breadcrumbHelper'
import { LAYOUT_SIDEBAR_DATA } from '@src/data/layout-sidebar-data'

export default function MobileBreadcrumbs() {
    const location = useLocation()
    const navigate = useNavigate()
    console.log(location)
    const breadcrumbs = getBreadcrumbs(
        location.pathname,
        LAYOUT_SIDEBAR_DATA
    )

    if (!breadcrumbs.length) {
        return null
    }

    return (
        <Box
            sx={{
                px: 2,
                py: 1,
                bgcolor: '#fff',
                borderBottom: '1px solid #eee',
            }}
        >
            <Breadcrumbs separator="›">
                {breadcrumbs.map((item, index) => {
                    const isLast =
                        index === breadcrumbs.length - 1

                    if (isLast) {
                        return (
                            <Typography
                                key={item.path}
                                fontWeight={700}
                                color="primary"
                            >
                                {item.label}
                            </Typography>
                        )
                    }

                    return (
                        <Link
                            key={item.path}
                            component="button"
                            underline="hover"
                            color="inherit"
                            onClick={() =>
                                item.path &&
                                navigate({
                                    to: item.path,
                                })
                            }
                        >
                            {item.label}
                        </Link>
                    )
                })}
            </Breadcrumbs>
        </Box>
    )
}