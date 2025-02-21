import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { CgSpinnerTwo } from "react-icons/cg";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import Logo from '../assets/images/logo.svg'
import FetchError from '../components/FetchError';

const SignIn = ({ setLoggedIn }) => {

  const API_URL = import.meta.env.VITE_API_URL;
  const PARAM = "employeeData";
  const ENDIPOIT = `${API_URL}${PARAM}`

  // React-router-dom hooks
  const navigate = useNavigate();
  const location = useLocation();

  // React hooks
  const [signinInput, setSigninInput] = useState({
    username: '',
    password: ''
  });
  const [forminvalid, setFrormInvalid] = useState(false);
  const [authData, setAuthData] = useState(null);
  const [authLoader, setAuthLoader] = useState(false)
  const [responseFail, setresposeFail] = useState(false);
  const [showPwd, setShowPwd] = useState(false)
  const toast = useRef(null);

  const toastNotify = ({ serverity = "success", summary = 'Success', detail = 'Message Content', life = 300000 }) => {
    toast.current.show(
      {
        severity: serverity,
        summary: summary,
        detail: detail,
        life: life
      }
    );
  }

  // Input Handler
  const handleInput = (e) => {
    const { name, value } = e.target;
    setSigninInput((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  useEffect(() => {
    if (localStorage.getItem("userlogged")) {
      navigate("/")
    }
  }, [location])

  useEffect(() => {

  })

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!signinInput.username || !signinInput.password) {
      toastNotify({
        serverity: "error",
        summary: "Error",
        detail: "Please enter required fields",
      })
      setSigninInput({
        username: '',
        password: ''
      })
      setFrormInvalid(true);
      return;
    }

    try {
      setAuthLoader(true)
      const response = await fetch(ENDIPOIT);
      if (!response.ok) {
        console.log("server problem")
        setresposeFail(true)
        throw new Error(`Somthing Went wrong!! ${response.ok}`);
      }
      const data = await response.json();
      setAuthLoader(false);

      const userValid = data?.employees?.find(auth => {
        return signinInput.username.toLowerCase() === auth.name.toLowerCase() && signinInput.password === auth.password
      })

      if (!userValid) {
        toastNotify({
          serverity: "error",
          summary: "Error",
          detail: "Please enter valid details",
        })
        setFrormInvalid(true);
        setSigninInput({
          username: '',
          password: ''
        })
      } else {
        setFrormInvalid(false)
        localStorage.setItem("userlogged", JSON.stringify({ authToken: userValid?.authToken, name: userValid?.name, role: userValid?.role }))
        setLoggedIn(true)
        navigate("/")

      }

    } catch (err) {
      toastNotify({
        serverity: "error",
        summary: "Error",
        detail: "Somthing went wrong!",
      })
      setAuthLoader(false);
      console.log(err)
    }
  }

  if (responseFail) {
    return (
      <div className='h-screen w-screen flex justify-center items-center'>
         <FetchError />
      </div>
    )
  }

  return (
    <div className='h-screen w-screen flex justify-center items-center relative'>
      <div className='fixed top-0 left-0 w-full p-0.5 bg-theme-primary text-theme-white text-center text-xs font-fontSemiBold'>
        This is a prototype. Login may take a moment—thank you for your patience!
      </div>
      <div className='w-full max-w-[320px] mx-[20px] space-y-5'>
        <div className='p-4 bg-white rounded-md border shadow'>
          <div className='flex justify-center mb-2 pb-2 border-b'>
            <img src={Logo} alt="logo" className="h-16" />
          </div>
          <form className='space-y-4 mt-4' onSubmit={handleSubmit}>
            <h4 className='text-base font-semibold'>Login to your account</h4>

            <div className="">
              <label htmlFor='username' className="block mb-1 text-sm">Username</label>
              <input
                id='username'
                type='text'
                className={`block border rounded w-full p-1.5 ${forminvalid ? 'border-theme-error' : 'border-theme-black'}`}
                name='username'
                value={signinInput.username}
                onChange={handleInput}
                autoFocus={true}
              />
            </div>

            <div className="">
              <label htmlFor='password' className="block mb-1 text-sm">Password</label>
              <div className='relative'>
                <input
                  id='password'
                  type={`${showPwd ? 'text' : 'password'}`}
                  className={`block border rounded w-full p-1.5 pr-8 ${forminvalid ? 'border-theme-error' : 'border-theme-black'}`}
                  name='password'
                  value={signinInput.password}
                  onChange={handleInput}
                />
                <button 
                  type='button' 
                  onClick={() => setShowPwd((current) => !current)}
                  className='absolute right-3 top-1/2 -translate-y-1/2'>
                    { showPwd ? <FaRegEye /> : <FaRegEyeSlash /> }
                </button>
              </div>
            </div>

            <div className='!mt-6'>
              <button type='submit' className={`primay-btn w-full font-fontSemiBold flex gap-x-2 items-center justify-center ${authLoader && 'pointer-events-none cursor-wait opacity-75'}`}>
                {authLoader && (
                  <CgSpinnerTwo className='animate-spin size-6' />
                )}
                <span>{!authLoader ? 'Login' : 'Loading...'}</span>
              </button>
            </div>

            {forminvalid && (
              <div>
                <p className='text-sm text-center text-theme-error'>Check your username or password</p>
              </div>
            )}

            <div className='text-end'>
              <a className='text-xs text-theme-primary' href=''>Forget password?</a>
            </div>
          </form>
        </div>

        <div className='p-2 bg-theme-primary rounded-md bg-opacity-95 border-2 border-theme-primary text-theme-white space-y-1'>
          <h4 className='font-fontSemiBold'>Demo Login</h4>
          <div className='space-y-0.5'>
            <h6 className='font-fontRegular'>User: <span className='font-fontSemiBold inline-block ml-1'>William Walker</span></h6>
            <h6 className='font-fontRegular'>Password: <span className='font-fontSemiBold inline-block ml-1'>zInc@14</span></h6>
          </div>
        </div>
      </div>
      <Toast ref={toast} className='max-w-[320px]' />
    </div>
  )
}

export default SignIn