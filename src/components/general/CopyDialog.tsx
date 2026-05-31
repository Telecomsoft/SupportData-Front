import React, { useEffect, useMemo, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid2'
import { useForm } from 'react-hook-form'
import { useGetData } from '@src/hooks/useGetData'
import AutoCompleteComp from './hookFromInputs/AutoComplete'
import DisplayCode from './DisplayCode'
import { KioskType } from '@src/data/type/userType'
import { sizeConverter } from '@src/utility/sizeConverter'
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined'
import CopyAllIcon from '@mui/icons-material/CopyAll'
import { Typography } from '@mui/material'
import useCopyStore from '@src/store/copyStore'

type settingType = 'network' | 'bank' | 'maintenance' | 'device' | 'service'

interface CopyDialogProps {
    open: boolean
    width?: number
    close: () => void
    copyType?: settingType
    options?: any
}
const CopyDialog: React.FC<CopyDialogProps> = ({ open, close, width, copyType = 'network', options }) => {
    const { setCopyKiosk, clearCopyData } = useCopyStore()

    const urlConf = {
        network: 'KioskIP',
        bank: 'Transaction',
        maintenance: 'DailyMaintenance',
        device: 'Device',
        service: 'KioskServiceSetting',
    }

    const { control, watch } = useForm<any>()
    const [selectedKioskSerial, setSelectedKioskSerial] = useState<string>('')

    const kiosks = useGetData<KioskType[]>('api/Kiosk/KioskDefine/ListAll', 'get-all-kiosks')

    const kioskData = useGetData(
        `api/Setting/${urlConf[copyType]}/List/${selectedKioskSerial}/${urlConf[copyType] === 'KioskServiceSetting' ? options?.items?.serviceName?.replace(/\s+/g, '') : ''}`,
        `get-data`,
        {
            ids: [selectedKioskSerial, copyType],
            enabled: !!selectedKioskSerial && !!copyType,
        }
    )

    const copyData = useMemo(() => {
        return kioskData?.data?.value
    }, [kioskData?.data?.value])

    useEffect(() => {
        const watchValue = watch('selectKiosk')
        if (watchValue) {
            setSelectedKioskSerial(watchValue?.id)
        }
    }, [watch('selectKiosk')])

    const autoCompleteData = kiosks?.data?.value?.map((kiosk: KioskType) => ({
        id: kiosk.kioskSerial,
        name: kiosk.kioskName,
    }))

    const handleCopy = () => {
        if (copyData) {
            setCopyKiosk(copyData)
            close()
        }
    }

    const handleClose = () => {
        clearCopyData()
        close()
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
                style: {
                    minWidth: width ? width : sizeConverter(600, 'width'),
                    borderRadius: sizeConverter(8, 'radius'),
                },
            }}
        >
            <DialogTitle>
                <Grid container size={12} justifyContent={'space-between'} alignItems={'center'}>
                    <Grid container alignItems="center" justifyContent={'space-between'} size={'auto'}>
                        <Grid container alignItems="center" size="grow">
                            <CopyAllIcon />
                        </Grid>
                        <Grid size={8} justifyContent={'flex-start'} alignItems={'center'} container>
                            <Grid size={12}>
                                <Typography noWrap variant="dialogSubTitle">
                                    کپی کیوسک
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid>
                        <HighlightOffOutlinedIcon
                            sx={{
                                color: '#CCCCCC',
                                width: sizeConverter(26),
                                height: sizeConverter(26),
                                cursor: 'pointer',
                                transition: '0.2s ease-in-out',
                                '&:hover': {
                                    color: '#000',
                                },
                            }}
                            onClick={handleClose}
                        />
                    </Grid>
                </Grid>
            </DialogTitle>

            <DialogContent>
                <Grid size={12} justifyContent={'center'} alignItems={'center'} container>
                    <AutoCompleteComp
                        autoCompleteOption={autoCompleteData ?? []}
                        value="selectKiosk"
                        control={control}
                        label={'انتخاب کیوسک'}
                        autocompleteType={'single'}
                        size={12}
                    />
                    {kioskData?.isLoading && (
                        <Grid container justifyContent="center" alignItems="center" sx={{ mt: sizeConverter(5, 'space') }}>
                            <CircularProgress />
                        </Grid>
                    )}
                    {!kioskData?.isLoading && !!watch('selectKiosk') && (
                        <Grid container size={12}>
                            <DisplayCode data={copyData || {}} />
                        </Grid>
                    )}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="main"
                    sx={{
                        bgcolor: '#e1e1e1',
                        color: '#000',
                        '&:hover': { bgcolor: '#c4c4c4' },
                    }}
                    onClick={handleClose}
                >
                    بستن
                </Button>
                <Button variant="main" onClick={handleCopy} color="primary" disabled={!selectedKioskSerial}>
                    کپی
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default CopyDialog
