import {SnackbarSeverity} from "@components/hoc/withSnackbar.tsx";

export type snackbarOpenType = (message: string, severity: SnackbarSeverity) => void
