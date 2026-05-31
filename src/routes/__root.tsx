// import { createRootRoute, Outlet, useLocation, useNavigate } from '@tanstack/react-router'
// import Layout from '@components/layout'
// import { useEffect } from 'react'
// import Cookies from 'js-cookie'

// export const Route = createRootRoute({
//     component: ProjectLayout,
// })

// function ProjectLayout() {
//     const location = useLocation()
//     const navigate = useNavigate()

//     useEffect(() => {
//         if (location.pathname !== '/') {
//             const authToken = Cookies.get('auth_token')
//             if (!authToken) {
//                 navigate({ to: '/' })
//             }
//         }
//     }, [location.pathname, navigate])

//     if (location.pathname !== '/') {
//         return (
//             <Layout>
//                 <Outlet />
//             </Layout>
//         )
//     } else {
//         return (
//             <>
//                 <Outlet />
//             </>
//         )
//     }
// }


// src/routes/__root.tsx
import { createRootRoute, Outlet, useLocation, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import Cookies from 'js-cookie'

// Import های جدید
import DesktopLayout from '@components/layout'                  

import { useDevice } from '@src/hooks/useDevice'
import { MobileLayout } from '@components/layout/MobileLayout'

export const Route = createRootRoute({
    component: ProjectLayout,
})

function ProjectLayout() {
    const location = useLocation()
    const navigate = useNavigate()
    const { isMobile } = useDevice()

    // Auth Guard
    useEffect(() => {
        if (location.pathname !== '/') {
            const authToken = Cookies.get('auth_token')
            if (!authToken) {
                navigate({ to: '/' })
            }
        }
    }, [location.pathname, navigate])

    if (location.pathname === '/') {
        return <Outlet />
    }

    // انتخاب هوشمند Layout
    return isMobile ? (
        <MobileLayout>
            <Outlet />
        </MobileLayout>
    ) : (
        <DesktopLayout>
            <Outlet />
        </DesktopLayout>
    )
}