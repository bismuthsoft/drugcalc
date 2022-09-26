import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom'
import App from './App'
import Home from './routes/Home'
import Recipes from './routes/Recipes'
import Ingredients from './routes/Ingredients'
import Containers from './routes/Containers'
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/recipes",
        element: <Recipes />,
      },
      {
        path: "/ingredients",
        element: <Ingredients />,
      },
      {
        path: "/containers",
        element: <Containers />,
      },
    ],
  }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
)
