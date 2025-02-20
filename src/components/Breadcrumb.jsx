import React from 'react'
import { Link, useLocation, useMatch } from 'react-router-dom'
import { LuHome } from "react-icons/lu";


const Breadcrumb = () => {

  const currLocation = useLocation().pathname;
  let isSingleRoute;

  const isEmployeeRoute = useMatch("/employee/*");
  const isProjectRoute = useMatch("/project/*");
  const isProductRoute = useMatch("/product/*") ;

  isSingleRoute = isEmployeeRoute ? isEmployeeRoute : isProjectRoute ? isProjectRoute : isProductRoute;
  
  const locationCahe = [
    {name: 'Home', route: '/'},
    {name: 'Employees', route: '/employees'},
    {name: 'Projects', route: '/projects'},
    {name: 'Products', route: '/products'}
  ]
  

  return (
    <div>
        <ul className='breadcrumnb flex gap-2 text-base font-fontSemiBold'>
            <li className='flex gap-2'>
                <Link to='/' className='inline-block md:hidden'><LuHome className='size-5' /></Link> 
                <Link to='/' className='hidden md:inline-block'>Dashboard</Link>
                <span>/</span>
            </li>
            {locationCahe.map((el, idx) => (
              (el?.route === currLocation || isSingleRoute?.pathnameBase.slice(0, 5) === el?.route.slice(0, 5)) && (
                <li className='opacity-75' key={idx}>{el?.name}</li>
              )
            ))}
        </ul>
        <div className='text-base font-fontSemiBold mt-1'>
          {locationCahe.map((el, idx) => (
              (el?.route === currLocation || isSingleRoute?.pathnameBase.slice(0, 5) === el?.route.slice(0, 5)) && (
                <span className='opacity-75' key={idx}>{el?.name}</span>
              )
          ))}
        </div>
    </div>
  )
}

export default Breadcrumb