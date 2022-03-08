// highlight
import './utils/highlight'

// scroll bar
import 'simplebar/src/simplebar.css'

// lightbox
import 'react-image-lightbox/style.css'

import 'react-quill/dist/quill.snow.css'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

// alice carousel
import 'react-alice-carousel/lib/alice-carousel.css'

import '_style.css'

import 'react-datepicker/dist/react-datepicker.css'

import ReactDOM from 'react-dom'
import React from 'react'
import Bugsnag from '@bugsnag/js'
import BugsnagPluginReact from '@bugsnag/plugin-react'

import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider, Helmet } from 'react-helmet-async'
import { SettingsProvider } from 'utils/context/settings'
import { CollapseDrawerProvider } from 'utils/context/drawer'

import App from './App'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import reportWebVitals from './reportWebVitals'

Bugsnag.start({
  apiKey: 'ea833790decab291dfcd5223843535c3',
  plugins: [new BugsnagPluginReact()],
})
const USERSNAP_API_KEY = "5db6ed72-2881-4310-ac50-712e39193b7e"
const USERSNAP_GLOBAL_API_KEY = "5db6ed72-2881-4310-ac50-712e39193b7e";

const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React)
ReactDOM.render(
  <ErrorBoundary>
    <HelmetProvider>
      <Helmet>
        <script type="text/javascript">
          {`
                  window.onUsersnapCXLoad = function(api) {
                    api.init();
                    api.show('${USERSNAP_API_KEY}') 
                  }
                  var script = document.createElement('script');
                  script.defer = 1;
                  script.src = 'https://widget.usersnap.com/global/load/${USERSNAP_GLOBAL_API_KEY}?onload=onUsersnapCXLoad';
                  document.getElementsByTagName('head')[0].appendChild(script);
              `}
        </script>
      </Helmet>
      <SettingsProvider>
        <CollapseDrawerProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </CollapseDrawerProvider>
      </SettingsProvider>
    </HelmetProvider>
  </ErrorBoundary>,
  document.getElementById('root'),
)

// If you want to enable client cache, register instead.
serviceWorkerRegistration.register()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
