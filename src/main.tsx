//@ts-nocheck

import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import theme from './theme'
import { CacheProvider } from '@emotion/react'
import { cacheRtl } from '../css/createEmotionCache.js'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export const queryClient: QueryClient = new QueryClient({
   defaultOptions: {
      queries: {
         staleTime: 0,
         refetchOnMount: true,
         refetchOnWindowFocus: false,
      },
   },
})

const router = createRouter({
   routeTree,
   context: {
      queryClient,
   },
   defaultPreload: 'intent',
   // Since we're using React Query, we don't want loader calls to ever be stale
   // This will ensure that the loader is always called when the route is preloaded or visited
   defaultPreloadStaleTime: 0,
})

// Register things for typesafety
declare module '@tanstack/react-router' {
   interface Register {
      router: typeof router
   }
}

// const TanStackRouterDevtools =
//     process.env.NODE_ENV === 'production'
//         ? () => null // Render nothing in production
//         : React.lazy(() =>
//             // Lazy load in development
//             import('@tanstack/router-devtools').then((res) => ({
//                 default: res.TanStackRouterDevtools,
//                 // For Embedded Mode
//                 // default: res.TanStackRouterDevtoolsPanel
//             })),
//         )

createRoot(document.getElementById('root')!).render(
   // <StrictMode>
   <QueryClientProvider client={queryClient}>
      <CacheProvider value={cacheRtl}>
         <ThemeProvider theme={theme}>
            <CssBaseline />
            <RouterProvider router={router} />
            {/*<TanStackRouterDevtools router={router}/>*/}
         </ThemeProvider>
      </CacheProvider>
      <div style={{ direction: 'ltr' }}>
         <ReactQueryDevtools initialIsOpen={false} position={'right'} />
      </div>
   </QueryClientProvider>
   // </StrictMode>,
)
