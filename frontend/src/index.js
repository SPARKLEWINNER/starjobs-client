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

ReactDOM.render(
  <HelmetProvider>
    <SettingsProvider>
      <CollapseDrawerProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CollapseDrawerProvider>
    </SettingsProvider>
  </HelmetProvider>,
  document.getElementById('root')
)

reportWebVitals()
