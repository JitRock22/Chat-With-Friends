
import './App.css'
import Interface from './modules/Dashboard/Interface'
import Form1 from './modules/Form/Form1'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('user:token') !== null || true;
  if (!isLoggedIn) {
    return <Navigate to={"/user/signin"} />
  } else if (isLoggedIn && ['/user/signin', 'user/signup'].includes(window.location.pathname)) {
    return <Navigate to={'/'} />
  }

  return children
}
const Router = createBrowserRouter([
  {
    path: "/",
    element:
      <ProtectedRoute><Interface /></ProtectedRoute>
  }, {
    path: "/user/signin",
    element: <ProtectedRoute><Form1 isSignin={true} /></ProtectedRoute>
  },
  {
    path: "/user/signup",
    element: <ProtectedRoute><Form1 isSignin={false} /></ProtectedRoute>
  },
]);
function App() {


  return (
    <>
      <div className=" h-screen flex justify-center items-center">
        {/* <Form1 /> */}
        {/* <Interface /> */}
        <RouterProvider router={Router} />
      </div>
    </>
  )
}

export default App
