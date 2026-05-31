/* eslint-disable @typescript-eslint/no-explicit-any */

import GeneralConfirmDialog from '@components/general/GeneralConfirmDialog'
import SuspendDialog from '@components/general/SuspendDialog'
import Grid from '@mui/material/Grid2'
import { sizeConverter } from '@src/utility/sizeConverter'
import { Suspense, useState } from 'react'
import Shutdown from '@public/icons/Shutdown.svg'
import RestartProgram from '@public/icons/RestartProgram.svg'
import Restart from '@public/icons/Restart.svg'
import SettingsRemoteIcon from '@mui/icons-material/SettingsRemote'
import DataGridIconProvider from '@components/general/telecomDataGrid/components/DataGridIconProvider.tsx'
import { usePostData } from '@src/hooks/usePostData'
import { ResType } from '@src/data/type/resType'
import { SNACKBAR_SEVERITIES, withSnackbar } from '@components/hoc/withSnackbar.tsx'
import { snackbarOpenType } from '@type/snackbarOpen.ts'
type ActionType = {
    snackbarOpen?: snackbarOpenType
    toolbarProps: {
        data: Record<string, any>
    }
}

const DataGridActions = ({ toolbarProps, snackbarOpen }: ActionType) => {
    const [openDialog, setOpenDialog] = useState<string | null>(null)
    const actionIcons = [
        { name: 'Shutdown', icon: Shutdown, toolTipText: 'Shutdown' },
        { name: 'RestartProgram', icon: RestartProgram, toolTipText: 'Restart Program' },
        { name: 'Restart', icon: Restart, toolTipText: 'Restart' },
        { name: 'RemoteDeskTopStart', icon: SettingsRemoteIcon, toolTipText: 'Remote Desktop Start' },
    ]

    const titles: Record<string, string> = {
        Shutdown: `خاموش  کردن کیوسک ${toolbarProps?.data?.kioskName} (${toolbarProps?.data?.kioskSerial})`,
        RestartProgram: `راه اندازی مجدد برنامه کیوسک ${toolbarProps?.data?.kioskName} (${toolbarProps?.data?.kioskSerial})`,
        Restart: `راه اندازی مجدد کیوسک ${toolbarProps?.data?.kioskName} (${toolbarProps?.data?.kioskSerial})`,
    }

    const createRemote = usePostData(`api/Setting/Control/RemoteDesktopStart/${toolbarProps?.data?.kioskSerial}`)

    const handleRemote = () => {
        createRemote?.mutate(
            {},
            {
                onSuccess: (data) => {
                    const res = data as ResType
                    if (res.error === 0) {
                        localStorage.setItem('remoteData', JSON.stringify(res?.value))
                        window.open('/remote', '_blank')
                        // snackbarOpen('مورد شما با موفقیت انجام شد', SNACKBAR_SEVERITIES.SUCCESS)
                    } else {
                        // snackbarOpen(res.error + ' ' + res.errorMessage, SNACKBAR_SEVERITIES.ERROR)
                    }
                },
                onError: (err: Error) => {
                    snackbarOpen!(err.message, SNACKBAR_SEVERITIES.ERROR)
                },
            }
        )
    }

    return (
        <Grid container size={12} alignItems={'center'} justifyContent={'flex-end'}>
            {actionIcons?.map((icon: any) => {
                return (
                    <>
                        <DataGridIconProvider
                            key={icon.name}
                            Icon={icon.icon}
                            clickFunc={icon.name !== 'RemoteDeskTopStart' ? () => setOpenDialog(icon.name) : handleRemote}
                            toolTipText={icon.toolTipText}
                            size={sizeConverter(14)}
                            disable={!toolbarProps?.data?.connectStatus}
                        />
                    </>
                )
            })}

            <Suspense fallback={<SuspendDialog />}>
                {openDialog !== 'RemoteDeskTopStart' && (
                    <GeneralConfirmDialog
                        dialogWidth={sizeConverter(650, 'width')}
                        // snackbarOpen={snackbarOpen}
                        apiMethod={'post'}
                        dialogCloseFun={() => setOpenDialog(null)}
                        dialogTitle={(openDialog ? titles?.[openDialog] : '') as string}
                        isDialogOpen={(openDialog as 'edit' | 'add') ?? null}
                        endPoint={`api/Setting/Control/${openDialog}/${toolbarProps?.data?.kioskSerial}`}
                        data={toolbarProps?.data}
                        confirmMessage={'از اعمال این تنظیمات برای کیوسک انتخاب شده اطمینان دارید؟'}
                        snackBarSuccessMessage={'با موفقیت اعمال شد'}
                        // {...(openDialog === 'RemoteDeskTopStart' && { customFunAfterSuccess: (e: any) => setRemoteData(e) })}
                    />
                )}
            </Suspense>
        </Grid>
    )
}

export default withSnackbar(DataGridActions)
