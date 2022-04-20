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

import {BrowserRouter} from 'react-router-dom'
import {HelmetProvider} from 'react-helmet-async'
import {SettingsProvider} from 'utils/context/settings'
import {CollapseDrawerProvider} from 'utils/context/drawer'

import App from './App'
import reportWebVitals from './reportWebVitals'
import ServiceWorkerWrapper from './pwa/ServiceWrapper'

ReactDOM.render(
  <>
    <HelmetProvider>
      <ServiceWorkerWrapper />
      <SettingsProvider>
        <CollapseDrawerProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </CollapseDrawerProvider>
      </SettingsProvider>
    </HelmetProvider>
  </>,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
