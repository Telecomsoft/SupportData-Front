import Grid from '@mui/material/Grid2'
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded'
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded'
import { sizeConverter } from '@utility/sizeConverter'
import { convertToPersianNumber } from '@utility/convertToPersianNumber'

type PaginationProps = {
    totalCount: number
    currentPage: number
    maxRowInPage: number
    DataGridLang: 'ENG' | 'FAR'
    onPageChange: (page: number) => void
    startTransition: any
}

const CustomPagination = ({ totalCount, currentPage, maxRowInPage, DataGridLang, onPageChange, startTransition }: PaginationProps) => {
    const totalPages = Math.ceil(totalCount / maxRowInPage)

    const getPageNumbers = () => {
        const delta = 2
        const range = []
        const rangeWithDots = []

        range.push(1)

        for (let i = currentPage - delta; i <= currentPage + delta; i++) {
            if (i > 1 && i < totalPages) {
                range.push(i)
            }
        }

        if (totalPages > 1) {
            range.push(totalPages)
        }

        let l
        for (let i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1)
                } else if (i - l !== 1) {
                    rangeWithDots.push('...')
                }
            }
            rangeWithDots.push(i)
            l = i
        }

        return rangeWithDots
    }

    const handlePageChange = (page: number) => {
        startTransition(() => {
            if (page >= 1 && page <= totalPages && page !== currentPage) {
                onPageChange(page)
            }
        })
    }

    const pageButtonStyles = {
        borderColor: 'dataGrid.borderColor',
        borderStyle: 'solid',
        borderWidth: sizeConverter(1),
        borderRadius: sizeConverter(3, 'radius'),
        p: sizeConverter(4, 'space'),
        minWidth: sizeConverter(22, 'width'),
        height: sizeConverter(22),
        lineHeight: 1.2,
        fontSize: sizeConverter(12),
        fontFamily: 'yekanBold',
        transition: '0.2s all ease-in-out',
        cursor: 'pointer',
        '&:hover': {
            color: 'white.0',
            bgcolor: 'dataGrid.main',
        },
    }

    const activePageStyles = {
        ...pageButtonStyles,
        bgcolor: 'dataGrid.main',
        color: 'white.0',
    }

    return (
        <Grid container size="auto" justifyContent="center" alignItems="center">
            <Grid
                container
                spacing={sizeConverter(0.75)}
                justifyContent="center"
                alignItems="center"
                direction={DataGridLang === 'FAR' ? 'row' : 'row-reverse'}
            >
                <Grid>
                    <Grid
                        container
                        justifyContent="center"
                        alignItems="center"
                        onClick={() => {
                            startTransition(() => {
                                handlePageChange(currentPage + 1)
                            })
                        }}
                        sx={{
                            ...pageButtonStyles,
                            opacity: currentPage === totalPages ? 0.5 : 1,
                            pointerEvents: currentPage === totalPages ? 'none' : 'auto',
                        }}
                    >
                        {DataGridLang === 'ENG' ? (
                            <NavigateBeforeRoundedIcon sx={{ p: 0, width: sizeConverter(12), height: sizeConverter(12) }} />
                        ) : (
                            <NavigateNextRoundedIcon sx={{ p: 0, width: sizeConverter(12), height: sizeConverter(12) }} />
                        )}
                    </Grid>
                </Grid>
                {getPageNumbers()
                    .reverse()
                    .map((pageNum, index) => (
                        <Grid key={index}>
                            <Grid
                                container
                                justifyContent="center"
                                alignItems="center"
                                onClick={() => {
                                    startTransition(() => {
                                        typeof pageNum === 'number' && handlePageChange(pageNum)
                                    })
                                }}
                                sx={
                                    pageNum === currentPage
                                        ? activePageStyles
                                        : {
                                              ...pageButtonStyles,
                                              cursor: typeof pageNum === 'number' ? 'pointer' : 'default',
                                              '&:hover': typeof pageNum === 'number' ? pageButtonStyles['&:hover'] : {},
                                          }
                                }
                            >
                                {DataGridLang === 'FAR' && typeof pageNum === 'number'
                                    ? convertToPersianNumber(pageNum.toString())
                                    : pageNum}
                            </Grid>
                        </Grid>
                    ))}

                <Grid>
                    <Grid
                        container
                        justifyContent="center"
                        alignItems="center"
                        onClick={() => {
                            startTransition(() => {
                                handlePageChange(currentPage - 1)
                            })
                        }}
                        sx={{
                            ...pageButtonStyles,
                            opacity: currentPage === 1 ? 0.5 : 1,
                            pointerEvents: currentPage === 1 ? 'none' : 'auto',
                        }}
                    >
                        {DataGridLang === 'ENG' ? (
                            <NavigateNextRoundedIcon sx={{ p: 0, width: sizeConverter(12), height: sizeConverter(12) }} />
                        ) : (
                            <NavigateBeforeRoundedIcon sx={{ p: 0, width: sizeConverter(12), height: sizeConverter(12) }} />
                        )}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default CustomPagination
