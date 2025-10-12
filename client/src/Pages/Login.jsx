import { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../Context/AuthContext'

const Login = () => {
  const [state, setState] = useState("Sign Up")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const {login} = useContext(AuthContext)

  const onSubmitHandeler = (e) => {
    e.preventDefault()

    if (state === "Sign Up" && !submitted) {
      setSubmitted(true) 
      return
    }

    login(state === "Sign Up" ? 'signup' : 'login',{fullName,email,password,bio})
    console.log({
      fullName,
      email,
      password,
      bio,
      state
    })
  }

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      <img src={assets.logo_big} alt='' className='w-[min(30vw,250px)]' />

      <form 
        onSubmit={onSubmitHandeler} 
        className='border-2 bg-white/10 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg w-[min(90%,400px)]'
      >
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {state}
          {submitted && (
            <img 
              onClick={() => setSubmitted(false)} 
              src={assets.arrow_icon} 
              alt='back' 
              className='w-5 cursor-pointer' 
            />
          )}
        </h2>

        {state === "Sign Up" && !submitted && (
          <input 
            onChange={(e) => setFullName(e.target.value)} 
            value={fullName} 
            type='text' 
            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' 
            placeholder='Full Name' 
            required 
          />
        )}

        {!submitted && (
          <>
            <input 
              onChange={(e) => setEmail(e.target.value)} 
              value={email} 
              type='email' 
              placeholder='Email Address' 
              required 
              className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' 
            />
            <input 
              onChange={(e) => setPassword(e.target.value)} 
              value={password} 
              type='password' 
              placeholder='Password' 
              required 
              className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' 
            />
          </>
        )}

        {state === "Sign Up" && submitted && (
          <textarea 
            onChange={(e) => setBio(e.target.value)} 
            value={bio} 
            rows={4} 
            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' 
            placeholder='Provide a short bio...' 
            required
          ></textarea>
        )}

        <button 
          type='submit' 
          className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'
        >
          {state === "Sign Up" ? (submitted ? "Finish Sign Up" : "Next") : "Login Now"}
        </button>

        {!submitted && (
          <div className='flex items-center gap-2 text-sm text-gray-400'>
            <input type='checkbox' required />
            <p>Agree to the terms of use & privacy policy</p>
          </div>
        )}

        <div className='flex flex-col gap-2 text-sm text-gray-300'>
          {state === "Sign Up" ? (
            <p>
              Already have an account?{" "}
              <span 
                onClick={() => { setState("Login"); setSubmitted(false) }} 
                className='font-medium text-violet-400 cursor-pointer'
              >
                Login here
              </span>
            </p>
          ) : (
            <p>
              Create an account{" "}
              <span 
                onClick={() => { setState("Sign Up"); setSubmitted(false) }} 
                className='font-medium text-violet-400 cursor-pointer'
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

export default Login
