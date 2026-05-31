import Dialog from "@mui/material/Dialog";
import CustomCircularProgress from "@components/general/CustomCircularProgress.tsx";

const SuspendDialog = () => {
    return (
        <Dialog
            // PaperProps={{
            //     style: { minWidth: sizeConverter(600, 'width') },
            // }}
            open={true}
            disableRestoreFocus
        >
            <CustomCircularProgress />
        </Dialog>
    )
}

export default SuspendDialog