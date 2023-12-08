import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import NotFoundPage from './NotFoundPage'
import JankenS from './janken-s-game/App'

const router = createBrowserRouter([
  {
    errorElement: <NotFoundPage />,
  },
  {
    path: "/janken-s",
    element: <JankenS />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

