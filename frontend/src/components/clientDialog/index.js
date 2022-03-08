import { useNavigate } from 'react-router-dom'
import {
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    DialogActions,
    Button,
    Typography,
    Stack
} from '@material-ui/core'


const ClientCompleteDialog = ({ open, handleClose }) => {
    const navigate = useNavigate();

    const handleCompleteMyDetails = () => {
        handleClose()
        navigate('/client/onboard', { replace: true })
    }
    return (
        <div>
            <Dialog open={open} >
                <DialogTitle sx={{ textAlign: 'center', pt: 5 }} >
                    <Typography variant="h4">Hi there!</Typography>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Typography variant="body2" sx={{ textAlign: 'center' }}>Kindly complete your application by providing detailed information. In order to proceed to Gigs.</Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ display: 'block', pb: 5, px: 5 }}>
                    <Stack row>
                        <Button color="primary" variant="contained" onClick={handleCompleteMyDetails}>
                            Complete my Details
                        </Button>
                        <Button onClick={handleClose} color="inherit" sx={{ mt: 2 }}>
                            Close
                        </Button>
                    </Stack>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default ClientCompleteDialog
