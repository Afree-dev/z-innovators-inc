import React, { useState, useEffect } from 'react'
import Logo from '../assets/images/logo.svg'
import { Link, NavLink, useMatch } from 'react-router-dom';
import { IoMdClose } from "react-icons/io";
import { LuHome, LuUsers } from "react-icons/lu";
import { PiNotepad } from "react-icons/pi";
import { BsBoxes } from "react-icons/bs";
import { FaUserCheck } from "react-icons/fa6";
import { Skeleton } from 'primereact/skeleton';

const Sidebar = ({currentUser, sidebarToggler}) => {

  const isEmployeeRoute = useMatch("/employee/*");
  const isProjectRoute = useMatch("/project/*");
  const isProductRoute = useMatch("/product/*") ;

  const [currUser, setCurrUser] = useState(null);

  useEffect(() => {
    setCurrUser(currentUser)
  }, [currentUser])

  return (
    <div className='p-2 relative z-50 bg-white gap-y-2 flex flex-col h-full border'>
      <div className=''>
        <button onClick={sidebarToggler} className='absolute bg-theme-black p-1 border-none rounded-full right-1 top-1 lg:hidden'>
          <IoMdClose className='fill-theme-white' />
        </button>
        <div className='flex justify-center pb-3 mb-3 border-b'>
          <div className='flex items-center gap-1'>
            <Link to="/">
              <img className='h-16' src={Logo} alt="Logo" />
            </Link>
          </div>
        </div>
        <div>
          <ul className='space-y-2'>
            <li>
              <NavLink to="/" className={({ isActive }) => `p-2 rounded-md font-fontSemiBold flex items-center gap-2 ${isActive ? 'bg-theme-primary text-theme-white' : 'text-theme-black hover:bg-black/5'}`}>
                <LuHome className="size-5 text-inherit" />
                <span>Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/employees" className={({ isActive }) => `p-2 rounded-md font-fontSemiBold flex items-center gap-2 ${isActive || isEmployeeRoute ? 'bg-theme-primary text-theme-white' : 'text-theme-black hover:bg-black/5'}`}>
                <LuUsers className="size-5 text-inherit" />
                <span>Employees</span>
              </NavLink>
            </li>
            <li>
              <NavLink to='/projects' className={({isActive}) => `p-2 rounded-md font-fontSemiBold flex items-center gap-2 ${isActive || isProjectRoute ? 'bg-theme-primary text-theme-white' : 'text-theme-black hover:bg-black/5'}`}>
                <PiNotepad className='size-5 text-inherit' />
                <span>Projects</span>
              </NavLink>
            </li>
            <li>
              <NavLink to='/products' className={({isActive}) => `p-2 rounded-md font-fontSemiBold flex items-center gap-2 ${isActive || isProductRoute ? 'bg-theme-primary text-theme-white' : 'text-theme-black hover:bg-black/5'}`}>
                <BsBoxes className='size-5 text-inherit' />
                <span>Products</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
      <div className='mt-auto pt-2 border-t'>
          <div>
            <h4 className='text-sm font-fontBold mb-2'>Logged in as</h4>
            <div className='flex gap-2'>
              <div>
              {currUser ? (
                <img src={currUser?.profileImage} alt="User Profile" title={currUser?.name} className='size-10 rounded-full object-center' />
              ) : (
                <Skeleton shape="circle" size="40px" className="bg-theme-black"></Skeleton>
              )}
              </div>
              <div>
                {currUser ? (
                  <h4 className='font-fontSemiBold text-base'>
                  {currUser?.name}
                </h4>
                ) : (
                  <Skeleton height="20px" width='10rem' className="mb-1"></Skeleton>
                )}
                {currUser ? (
                  <p className='text-xs'>
                    {currUser?.role}
                  </p>
                ) : (
                  <Skeleton height="16px" width='5rem' className=""></Skeleton>
                )}
              </div>
            </div>
          </div>
      </div>
    </div>
  )
}

export default Sidebar