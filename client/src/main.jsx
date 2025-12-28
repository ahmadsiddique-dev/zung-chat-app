import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Login from './Login.jsx'
import SignUp from './Signup.jsx'
import { Provider } from "react-redux"
import { userStore } from './store/user.js'
import ProtectedRoute from './components/ProtectedRoute.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute><App /></ProtectedRoute>
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/signup",
    element: <SignUp />
  }
])
{/* <RouterProvider /> */ }
createRoot(document.getElementById('root')).render(
  <Provider store={userStore}>
    <RouterProvider router={router} />
  </Provider>
  //     <StrictMode>
  // </StrictMode>
)
