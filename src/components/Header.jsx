import React, { useEffect, useState, useRef } from 'react'
import Breadcrumb from './Breadcrumb'
import { IoMenu } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";
import { LuBell } from "react-icons/lu";
import { Menu } from 'primereact/menu';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from 'primereact/skeleton';

const Header = ({currentUser, sidebarToggler}) => {

  const navigate = useNavigate();

  const [currUser, setCurrUser] = useState(null);
  const menuRight = useRef(null);
  const items = [
    {
        label: 'Options',
        items: [
            {
                label: 'Logout',
                icon: 'pi pi-user',
                command: () => {
                  localStorage.removeItem("userlogged");
                  navigate("/signin")
              }
            }
        ]
    }
  ];

  useEffect(() => {
    setCurrUser(currentUser)
  }, [currentUser])

  return (
    <header className='flex justify-between items-start gap-5'>
        <Breadcrumb />

        <div className='flex gap-3 items-center'>
          {window.innerWidth <= 1024 && (
            <button onClick={sidebarToggler}>
              <IoMenu className='size-7' title='Menu' />
            </button>
          )}
          <LuBell className='size-7' />
          <div>
            {currUser ? (
              <div className='size-9'>
                  <button className='rounded-full' onClick={(event) => menuRight.current.toggle(event)} aria-controls="popup_menu_right" aria-haspopup>
                    <img 
                      src={currUser?.profileImage} 
                      alt="User Profile" title={currUser?.name} 
                      className='size-9 rounded-full object-center' 
                    />
                  </button>
                  <Menu model={items} popup ref={menuRight} id="popup_menu_right" popupAlignment="right" />
              </div>
            ) : (
              <Skeleton shape="circle" size="36px" className="bg-theme-black"></Skeleton>
            )}
          </div>
        </div>
    </header>
  )
}

export default Header