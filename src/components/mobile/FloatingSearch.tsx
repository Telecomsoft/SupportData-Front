import { Box, Fab, Zoom, IconButton, InputAdornment } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import CloseIcon from "@mui/icons-material/Close"
import StyledTextField from "@components/general/input/StyledTextField"
import { useTheme } from "@mui/material/styles"

type FloatingSearchProps = {
    title?: string
    value: string
    setSearchQuery: (e: any) => void
    isOpen: boolean
    setIsOpen: (v: boolean) => void
    position?: any
}

export default function FloatingSearch({
    title = "جستجو...",
    value,
    setSearchQuery,
    isOpen,
    setIsOpen,
    position,
}: FloatingSearchProps) {
    const theme = useTheme()

    return (
        <Box
            sx={{
                position: "fixed",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 2,
                zIndex: 100,
                ...position,
            }}
        >
            <Zoom in={isOpen}>
                <Box sx={{ width: "100%", display: isOpen ? "block" : "none" }}>
                    <StyledTextField
                        fullWidth
                        placeholder={title}
                        value={value}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "30px",
                                backgroundColor: theme.palette.background.paper,
                                boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
                                top: 18
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="primary" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            setIsOpen(false)
                                            setSearchQuery('')
                                        }}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
            </Zoom>

            {!isOpen && <Fab
                size="medium"
                onClick={() => setIsOpen(!isOpen)}
                sx={{
                    bgcolor: isOpen
                        ? theme.palette.error.light
                        : theme.palette.background.paper,
                    color: isOpen ? "#fff" : theme.palette.primary.main,
                    boxShadow: 4,
                }}
            >
                <SearchIcon />
            </Fab>}
        </Box>
    )
}
