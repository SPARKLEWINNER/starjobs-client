// highlight
import './utils/highlight'

// scroll bar
import 'simplebar/src/simplebar.css'

// lightbox
import 'react-image-lightbox/style.css'

import 'react-quill/dist/quill.snow.css'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

// alice carousel
import 'react-alice-carousel/lib/alice-carousel.css'

import './_style.css'

import 'react-datepicker/dist/react-datepicker.css'

import ReactDOM from 'react-dom'

import {BrowserRouter} from 'react-router-dom'
import {HelmetProvider} from 'react-helmet-async'
import {SettingsProvider} from 'src/contexts/settings'
import {CollapseDrawerProvider} from 'src/contexts/drawer'

import App from './App'
import reportWebVitals from './reportWebVitals'

import {ServiceWorkerProvider} from './pwa/pwa-context'
import * as serviceWorker from './serviceWorkerRegistration'

ReactDOM.render(
  <HelmetProvider>
    <ServiceWorkerProvider>
      <SettingsProvider>
        <CollapseDrawerProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </CollapseDrawerProvider>
      </SettingsProvider>
    </ServiceWorkerProvider>
  </HelmetProvider>,
  document.getElementById('root')
)

serviceWorker.register({
  onUpdate: (registration) => {
    const waitingServiceWorker = registration.waiting

    if (waitingServiceWorker) {
      waitingServiceWorker.addEventListener('statechange', (event) => {
        if (event.target.state === 'activated') {
          window.location.reload()
        }
      })
      waitingServiceWorker.postMessage({type: 'SKIP_WAITING'})
    }
  }
})

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
