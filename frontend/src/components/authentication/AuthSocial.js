import { Icon } from '@iconify/react'
import googleFill from '@iconify/icons-eva/google-fill'
import { Stack, Button, Divider, Link, Typography } from '@material-ui/core'

const { REACT_APP_API_URL } = process.env

export default function AuthSocial() {
  return (
    <>
      <Stack direction="column" spacing={2}>
        <div>
          <Link href={`${REACT_APP_API_URL}/google`} style={{ width: '100%' }}>
            <Button fullWidth size="large" color="inherit" variant="outlined">
              <Icon icon={googleFill} color="#DF3E30" height={24} />
            </Button>
          </Link>
        </div>
      </Stack>

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          OR
        </Typography>
      </Divider>
    </>
  )
}
