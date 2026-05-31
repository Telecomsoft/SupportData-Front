import {SyntheticEvent, useState} from "react";
import { Alert, AlertColor } from "@mui/lab";
import { Snackbar, SnackbarOrigin } from "@mui/material";

export const SNACKBAR_SEVERITIES = {
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
} as const;

export type SnackbarSeverity = typeof SNACKBAR_SEVERITIES[keyof typeof SNACKBAR_SEVERITIES];

const defaultDuration = 2500;
const defaultAutoHide = true;
const maxSizeOfMessage = 200;

interface WithSnackbarProps {
    snackbarOpen: (
        message: string,
        severity?: SnackbarSeverity,
        autoHide?: boolean,
        duration?: number,
        coordinates?: SnackbarOrigin
    ) => void;
}

export function withSnackbar<P extends object>(WrappedComponent: React.ComponentType<P>) {
    const SnackbarComponent: React.FC<P> = (props: P) => {
        const [open, setOpen] = useState(true);
        const [autoHide, setAutoHide] = useState(defaultAutoHide);
        const [message, setMessage] = useState<string>('');
        const [duration, setDuration] = useState(defaultDuration);
        const [severity, setSeverity] = useState<SnackbarSeverity>(SNACKBAR_SEVERITIES.INFO);
        const [coordinates, setCoordinates] = useState<SnackbarOrigin>({
            vertical: 'top',
            horizontal: 'left',
        });

        const snackbarOpen = (
            message: string,
            severity: SnackbarSeverity = SNACKBAR_SEVERITIES.INFO,
            autoHide: boolean = defaultAutoHide,
            duration: number = defaultDuration,
            coordinates: SnackbarOrigin = {
                vertical: 'top',
                horizontal: 'right',
            }
        ) => {
            if (!message || typeof message !== 'string' || message.length > maxSizeOfMessage) {
                return;
            }

            setMessage(message);
            setSeverity(severity);
            setDuration(duration);
            setAutoHide(autoHide);
            setCoordinates(coordinates);
            setOpen(true);
        };

        const handleClose = (_event: Event | SyntheticEvent<unknown, Event>,reason?: string) => {
            if (reason === "clickaway") {
                return;
            }
            setOpen(false);
        };

        return (
            <>
                <WrappedComponent {...props as P & WithSnackbarProps} snackbarOpen={snackbarOpen} />
                {message && (
                    <Snackbar
                        anchorOrigin={coordinates}
                        open={open}
                        autoHideDuration={autoHide ? duration : undefined}
                        onClose={handleClose}
                        key={`${coordinates.vertical}${coordinates.horizontal}`}
                    >
                        <Alert onClose={handleClose} severity={severity as AlertColor} sx={{ width: '100%', px: 2, borderRadius: 50 }}>
                            {message}
                        </Alert>
                    </Snackbar>
                )}
            </>
        );
    };

    return SnackbarComponent;
}
