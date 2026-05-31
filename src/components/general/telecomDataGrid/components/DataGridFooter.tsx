import { Dispatch, FunctionComponent, SetStateAction } from 'react'
import Grid from '@mui/material/Grid2'
import { sizeConverter } from '@utility/sizeConverter'
import CustomPagination from '@components/general/telecomDataGrid/components/CustomPagination'
import Typography from '@mui/material/Typography'
import { TELECOM_DICTIONARY } from '@components/general/telecomDataGrid/staticData/telecom-dictionary.ts'
import { convertToPersianNumber } from '@utility/convertToPersianNumber.ts'

type PaginationProps = {
    totalCount: number
    currentPage: number
    maxRowInPage: number
    paginationConfig: boolean
    DataGridLang: 'ENG' | 'FAR'
    onPageChange: (page: number) => void
    CustomFooter?: FunctionComponent<any>
    SecondFooter?: FunctionComponent<any>
    footerProps?: any
    setSelectedRows: Dispatch<SetStateAction<Set<number | string>>>
    selectedRows: Set<number | string>
    multiSelect?: boolean
    startTransition?:any
}

const DataGridFooter = ({
    totalCount,
    currentPage,
    maxRowInPage,
    DataGridLang,
    onPageChange,
    paginationConfig,
    footerProps,
    CustomFooter,
    setSelectedRows,
    selectedRows,
    multiSelect,
    SecondFooter,
                            startTransition,
}: PaginationProps) => {
    return (
        <Grid
            container
            size={12}
            alignItems={SecondFooter ? 'flex-end' : 'center'}
            sx={{
                bgcolor: 'bgColor.0',
                height: sizeConverter(SecondFooter ? 65 : 40, 'height'),
                p: sizeConverter(6, 'space'),
                borderTopStyle: 'solid',
                borderTopWidth: sizeConverter(1),
                borderTopColor: 'dataGrid.borderColor',
            }}
        >
            {!!SecondFooter && (
                <Grid container size={12}>
                    <SecondFooter />
                </Grid>
            )}

            <Grid
                container
                size={12}
                justifyContent="space-between"
                alignItems="center"
                direction={DataGridLang === 'FAR' ? 'row-reverse' : 'row'}
            >
                <Grid container size="grow" justifyContent={DataGridLang === 'FAR' ? 'flex-end' : 'flex-start'} alignItems="center">
                    {CustomFooter && (
                        <CustomFooter footerProps={footerProps} setSelectedRows={setSelectedRows} selectedRows={selectedRows} />
                    )}
                </Grid>
                {paginationConfig && (
                    <CustomPagination
                        totalCount={totalCount}
                        currentPage={currentPage}
                        maxRowInPage={maxRowInPage}
                        DataGridLang={DataGridLang}
                        onPageChange={onPageChange}
                        startTransition={startTransition}
                    />
                )}
                <Grid container size="grow" justifyContent={DataGridLang === 'FAR' ? 'flex-start' : 'flex-end'} alignItems="center">
                    {totalCount !== 0 && !!totalCount && (
                        <Typography variant="normal">
                            {TELECOM_DICTIONARY[DataGridLang]['TotalCount']}
                            {DataGridLang === 'FAR'
                                ? `${convertToPersianNumber((maxRowInPage * (currentPage - 1) + 1).toString())} - ${convertToPersianNumber(totalCount < (currentPage * maxRowInPage) ? totalCount.toString() : (currentPage * maxRowInPage).toString())} ${TELECOM_DICTIONARY[DataGridLang]['Of']} ${convertToPersianNumber(totalCount.toString())}`
                                : totalCount}
                            {selectedRows.size !== 0 && !!selectedRows && multiSelect && (
                                <>
                                    {' / '}
                                    {TELECOM_DICTIONARY[DataGridLang]['SelectCount']}
                                    {DataGridLang === 'FAR'
                                        ? convertToPersianNumber(selectedRows.size ? selectedRows.size.toString() : '')
                                        : selectedRows.size}
                                </>
                            )}
                        </Typography>
                    )}
                </Grid>
            </Grid>
        </Grid>
    )
}

export default DataGridFooter
