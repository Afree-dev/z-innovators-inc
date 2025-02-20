import React, { useEffect, useRef, useState } from "react"
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom"
import Header from "./components/Header"
import Sidebar from "./components/SideBar"
import AdminDashboard from "./pages/AdminDashboard"
import Error from "./pages/Error"
import SignIn from "./pages/SignIn"
import Employees from "./pages/Employees"
import Employee from "./pages/Employee"
import { Toast } from 'primereact/toast';
import Projects from "./pages/Projects"
import Products from "./pages/Products"
import FetchError from "./components/FetchError"

function App() {

  const API_URL = import.meta.env.VITE_API_URL;
  const PARAM = "employeeData";
  const EMPLOYEE_ENDIPOIT = `${API_URL}${PARAM}`

  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [responseFail, setresposeFail] = useState(false);
  const toast = useRef(null);
  const sidebarRef = useRef(null)

  const hideSidebarPaths = ['/signin', '/error'];
  const shouldHideSidebar = !hideSidebarPaths.includes(location.pathname);
  
  useEffect(() => {
    if(!localStorage.getItem("userlogged") && !user) {
      navigate("/signin")
    } else {
      if(loggedIn) {
        toastNotify({
          serverity: "success",
          summary: "Success",
          detail: "Logged in successfully",
        })
      }
      const localData = JSON.parse(localStorage.getItem("userlogged"))
      setUser(localData);
    }
  }, [loggedIn])

  useEffect(() => {
    if(user) {
      (async() => {
        try {
          setLoading(true)
          const response = await fetch(EMPLOYEE_ENDIPOIT);
          if(!response.ok) {
            setresposeFail(true)
            throw new Error("Somthing Went Wrong");
          }
          const data = await response.json();
          const validUser = data?.employees?.find(auth => {
            return user?.name === auth?.name && user?.role === auth?.role && user?.authToken === auth?.authToken
          })

          setCurrentUser(validUser)
          
          if(!validUser) {
            localStorage.removeItem("userlogged")
            navigate("/signin")
            toastNotify({
              serverity: "error",
              summary: "Error",
              detail: "Session expiered",
            })
          }

        } catch (err) {
          setresposeFail(true)
          console.log(err)
        } finally {
          setLoading(false)
        }
      })();
    }
  }, [user])

  const toastNotify = ({serverity = "success", summary = 'Success', detail = 'Message Content', life = 3000 }) => {
    toast.current.show(
      {
        severity: serverity, 
        summary: summary, 
        detail: detail, 
        life: life
      }
    )
  }

  const sidebarToggler = () => {
    sidebarRef.current.classList.toggle("active")
    const body = document.querySelector("body");
    const currentOverflow = body.style.overflow;
    const newOverflow = (currentOverflow === '' || currentOverflow === 'auto') ? 'hidden' : 'auto';
    body.style.overflow = newOverflow;
  }

  if(responseFail) {
    return (
      <div className='h-screen w-screen flex justify-center items-center'>
         <FetchError />
      </div>
    )
  }

  return (
    <>
     <div className="min-h-screen">
        {shouldHideSidebar && (
          <div ref={sidebarRef} className="group">
            <aside className="w-72 m-4 mr-0 fixed z-50 h-[calc(100vh-32px)] border bg-white rounded-lg overflow-hidden overflow-y-auto translate-x-[-110%] group-[.active]:translate-x-0 lg:translate-x-0 transition-all">
              <Sidebar 
                currentUser={currentUser} 
                sidebarToggler = {sidebarToggler}
              />
            </aside>
            <div className="fixed h-screen w-screen inset-0 bg-black/45 -z-40 opacity-0 invisible group-[.active]:z-40 group-[.active]:opacity-100 group-[.active]:visible"></div>
          </div>
        )}
        <div className={`${shouldHideSidebar && 'lg:ml-80 p-4 flex flex-col min-h-screen'}`}>
          {shouldHideSidebar && (
            <Header 
              currentUser={currentUser} 
              sidebarToggler = {sidebarToggler}
            />
          )}
          <div className={`${shouldHideSidebar && 'mt-8'}`}>
            <Routes>
              <Route path="/" element={<AdminDashboard />}/>
              <Route path="/employees" element={<Employees />} />
              <Route path="/employee/:id" element={<Employee />} />
              <Route path="/signin" element={<SignIn setLoggedIn={setLoggedIn} />}/>
              <Route path="/projects" element={<Projects />} />
              <Route path="/products" element={<Products />} />
              <Route path="/error" element={<Error />}/>
              <Route path="/*" element={<Navigate to="/error" />} />
            </Routes>
          </div>
          {shouldHideSidebar && (
            <footer className="mt-auto">
              <div className="mt-5 p-1 text-xs text-right">
                Designed and Developed by <Link to="https://imafreedh.vercel.app/" target="_blank" className="underline underline-offset-2">@afree-dev</Link>
              </div>
            </footer>
          )}
        </div>
     </div>
     <Toast ref={toast} />
    </>
  )
}

export default App
