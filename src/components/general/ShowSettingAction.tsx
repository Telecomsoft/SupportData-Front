import IconProvider from './IconProvider'
import Grid from '@mui/material/Grid2'
import { usePostData } from '@src/hooks/usePostData'
import { sizeConverter } from '@src/utility/sizeConverter'
import updateRowStore from '@src/store/updateRowStore'
import { queryClient } from '@src/main.tsx'

function ShowSettingAction({ icon, api, data }: { icon: any; api: string; data: Record<string, any> }) {
    const createEndpoint = usePostData(api)
    const { setRow } = updateRowStore()

    const submitAction = () => {
        const serials = [data?.kioskSerial]
        createEndpoint.mutate(serials, {
            onSuccess: (res: any) => {
                // snackbarOpen?.(res.data.error + ' ' + res.data.errorMessage, SNACKBAR_SEVERITIES.ERROR)
                queryClient?.refetchQueries({ queryKey: ['get-list-view'] })
                queryClient?.refetchQueries({ queryKey: ['devices-constants'] })
                queryClient?.refetchQueries({ queryKey: ['kiosks-devices'] })
                setRow(res?.value?.pop())
            },
            onError: () => {
                // snackbarOpen?.(err.message, SNACKBAR_SEVERITIES.ERROR)
            },
        })
    }

    return (
        <Grid container alignItems={'center'} justifyContent={'center'} size={12} columnGap={sizeConverter(4, 'spaceX')}>
            <IconProvider
                disable={!data?.isConnected}
                Icon={icon}
                clickFunc={submitAction}
                extraStyle={{
                    transition: 'opacity 0.5s ease-out',
                    ...(createEndpoint?.isPending && {
                        '@keyframes fade': {
                            '0%': {
                                opacity: 1,
                            },
                            '50%': {
                                opacity: 0.25,
                            },
                            '100%': {
                                opacity: 1,
                            },
                        },
                        animation: 'fade 1s infinite',
                    }),
                }}
            />
        </Grid>
    )
}

export default ShowSettingAction
