import React from 'react'
import ReactDOM from 'react-dom/client'
import { Route, Routes } from 'react-router-dom'
import JankenS from './janken-s-game/App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <JankenS />
  </React.StrictMode>,
)

