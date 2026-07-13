import React from 'react'
import { createRoot } from 'react-dom/client'
import HawkimTrack from './HawkimTrack'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HawkimTrack />
  </React.StrictMode>
)
