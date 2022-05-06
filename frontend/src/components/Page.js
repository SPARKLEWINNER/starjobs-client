import PropTypes from 'prop-types'
import {Helmet} from 'react-helmet-async'
import {forwardRef} from 'react'
import {Box} from '@mui/material'

const {REACT_APP_USERSNAP_API_KEY, REACT_APP_USERSNAP_GLOBAL_API_KEY} = process.env

const Page = forwardRef(({children, title = '', ...other}, ref) => (
  <Box ref={ref} {...other}>
    <Helmet>
      <title>{title}</title>
    </Helmet>
    {children}

    <script type="text/javascript">
      {`
                  window.onUsersnapCXLoad = function(api) {
                    api.init();
                    api.show('${REACT_APP_USERSNAP_API_KEY}') 
                  }
                  var script = document.createElement('script');
                  script.defer = 1;
                  script.src = 'https://widget.usersnap.com/global/load/${REACT_APP_USERSNAP_GLOBAL_API_KEY}?onload=onUsersnapCXLoad';
                  document.getElementsByTagName('head')[0].appendChild(script);
              `}
    </script>
  </Box>
))

Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string
}

export default Page
