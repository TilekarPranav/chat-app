import { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Profile from './Pages/Profile'
import {Toaster} from 'react-hot-toast'
import { AuthContext } from '../Context/AuthContext'
const App = () => {
  const {authUser} = useContext(AuthContext)
  return (
    <div className="bg-[url('/bgImage.svg')] bg-contain">
      <Toaster/>
      <Routes>
        <Route path="/" element={authUser ? <Home /> : <Navigate to={"/login"}/>} />
        <Route path="/login" element={!authUser ? <Login /> : <Navigate to={"/"}/>} />
        <Route path="/Profile" element={ authUser ? <Profile /> : <Navigate to={"/login"}/>} />
      </Routes>
    </div>
  )
}

export default App
