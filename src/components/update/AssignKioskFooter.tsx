
import { Dispatch, SetStateAction } from 'react'
import Grid from '@mui/material/Grid2'
import { sizeConverter } from '@src/utility/sizeConverter'
import { Button } from '@mui/material'
import CustomCircularProgress from '@components/general/CustomCircularProgress'
import { usePostData } from '@src/hooks/usePostData'

const AssignKioskFooter = ({
    footerProps,
}: {
    footerProps: any
    setSelectedRows: Dispatch<SetStateAction<Set<number>>>
    selectedRows: Set<number>
}) => {
    const createItem = usePostData(footerProps?.createEndpoint ? footerProps?.createEndpoint : '')

    return (
        <Grid container size={12} justifyContent={'flex-end'} alignItems={'center'}>
            <Button onClick={footerProps?.onSubmit ? footerProps?.onSubmit : undefined} variant="main" >
                {createItem?.isPending || footerProps?.isLoading ? (
                    <CustomCircularProgress noPadding color={'white.0'} size={sizeConverter(16)} />
                ) : (
                    <>{footerProps?.buttonName ? footerProps?.buttonName : 'ارسال'}</>
                )}
            </Button>
        </Grid>
    )
}

export default AssignKioskFooter