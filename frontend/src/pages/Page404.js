// react
import { useContext } from 'react'
import { Link as RouterLink } from 'react-router-dom';

// motion
import { motion } from 'framer-motion';

// material
import { styled } from '@material-ui/core/styles';
import { Box, Button, Typography, Container } from '@material-ui/core';

// components
import { MotionContainer, varBounceIn } from '../components/animate';
import Page from '../components/Page';

// context
import { UsersContext } from 'utils/context/users';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(5),
  paddingBottom: theme.spacing(5)
}));

// ----------------------------------------------------------------------

export default function Page404() {
  const { user } = useContext(UsersContext)

  return (
    <RootStyle title="404 Page Not Found - Starjobs">
      <Container>
        <MotionContainer initial="initial" open>
          <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
            <motion.div variants={varBounceIn}>
              <Typography variant="h3" paragraph>
                Sorry, page not found!
              </Typography>
            </motion.div>
            <Typography sx={{ color: 'text.secondary' }}>
              Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL?
              Be sure to check your spelling.
            </Typography>

            <motion.div variants={varBounceIn}>
              <Box
                component="img"
                src="/static/illustrations/illustration_404.svg"
                sx={{ height: 200, mx: 'auto', my: { xs: 5, sm: 10 } }}
              />
            </motion.div>
            <Button to={user ? `${user.accessType}` : `/`} size="large" variant="contained" component={RouterLink}>
              Go to Home
            </Button>
          </Box>
        </MotionContainer>
      </Container>
    </RootStyle>
  );
}
