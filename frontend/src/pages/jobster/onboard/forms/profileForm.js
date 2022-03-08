import { useState, useCallback } from 'react';
// material
import {
    Box,
    Stack,
    Typography,
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab'
import { useSnackbar } from 'notistack5'
// utils
import { fData } from 'utils/formatNumber';
// components
import { UploadAvatar } from 'components/upload';


import onboard_api from 'utils/api/onboard'
export default function Upload({ onNext, onStoreData }) {
    const { enqueueSnackbar } = useSnackbar();
    const [avatarUrl, setAvatarUrl] = useState('');
    const [isLoading, setLoading] = useState(false)

    const handleDropAvatar = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];

        if (file) {
            setAvatarUrl({
                ...file,
                preview: URL.createObjectURL(file),
                file: file
            });
        }
    }, []);

    const handleContinue = async () => {
        setLoading(true)

        if (!avatarUrl.file) {
            setLoading(false)
            return enqueueSnackbar("No Profile image selected", { variant: 'warning' })
        }
        const upload_image = await onboard_api.request_upload_url(avatarUrl.file);

        if (!upload_image) {
            setLoading(false)
            return enqueueSnackbar("Something went wrong in uploading your image.", { variant: 'warning' })
        }

        onStoreData(upload_image, "photo")
        onNext();
        setLoading(false)

    }

    return (
        <>
            <Stack spacing={5}>
                <Typography variant="body1" sx={{ mb: 0, fontWeight: 'bold', textAlign: 'center' }}>Please upload a professional portrait that clearly shows your face</Typography>
                <Box sx={{ textAlign: 'center' }}>
                    <UploadAvatar
                        accept="image/*"
                        file={avatarUrl}
                        onDrop={handleDropAvatar}
                        caption={
                            <Typography
                                variant="caption"
                                sx={{
                                    mt: 2,
                                    mx: 'auto',
                                    display: 'block',
                                    textAlign: 'center',
                                    color: 'text.secondary'
                                }}
                            >
                                Allowed *.jpeg, *.jpg, *.png, *.gif
                                <br /> max size of {fData(3145728)}
                            </Typography>
                        }
                    />
                </Box>
                <LoadingButton fullWidth size="large" onClick={handleContinue} variant="contained" loading={isLoading}>
                    Continue
                </LoadingButton>
            </Stack>
        </>
    );
}
