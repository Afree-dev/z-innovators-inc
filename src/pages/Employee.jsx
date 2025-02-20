import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { CgSpinnerTwo } from 'react-icons/cg';
import logo from '../assets/images/logo.svg';
import Loading from '../components/Loading';
import FetchError from '../components/FetchError';

const Employee = () => {

  const API_URL = import.meta.env.VITE_API_URL;
  const PARAM = "employeeData";
  const FINANCE_ENDIPOIT = `${API_URL}${PARAM}`

  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const urlParam = parseInt(useParams()?.id);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(FINANCE_ENDIPOIT)
        if (!response.ok) throw new Error("Somthing went wrong!!!");
        const data = await response.json();
        setEmployeeData(data?.employees[urlParam - 1])
      } catch (error) {
        setError(true)
      } finally {
        setLoading(false)
      }
    })();
  }, [])

  useEffect(() => {
    if (employeeData === undefined) {
      navigate('/employees')
    }
  }, [employeeData])

  const handleHrAction = (e) => {
    navigate("/error")
  }

  const isActive = useMemo(() => {
    return Math.ceil(Math.random() * 10) % 2;
  }, [])


  if (error) {
    return (
      <>
        <FetchError />
      </>
    )
  }

  function getPercentage(percent) {
    return <span className={`font-fontBold ${percent >= 75 ? 'text-green-600' : percent >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>{percent}</span>
  }

  function getSalary(salary) {
    if (salary > 100000) {
      return (salary / 100000).toFixed(1) + ' LPA'
    } else {
      return (salary / 10000).toFixed(1) + ' K'
    }
  }

  function getJoiningDate(exp) {
    const today = new Date();
    today.setFullYear(today.getFullYear() - exp);
    return today.toDateString();
  }

  return (
    <>
      {!loading ? (
        <div className='shadow'>
          <div style={{ backgroundImage: `url(${logo})` }} className="h-40 rounded-ss-lg rounded-se-lg bg-theme-primary bg-no-repeat bg-center"></div>
          <div className="bg-white rounded-es-lg rounded-ee-lg p-3">
            <div className='flex gap-3'>
              <img className="relative -mt-10 rounded-full size-24" src={employeeData?.profileImage} alt={employeeData?.name} />
              <div>
                <h4 className='text-lg font-fontSemiBold flex items-start gap-2'><span>{employeeData?.name} </span> <span className={`text-xs px-2 py-1 rounded-full ${isActive == 0 ? 'text-theme-green bg-theme-green/20' : 'text-theme-error bg-theme-error/20'} `}>{isActive == 0 ? 'Active' : 'Inactive'}</span> </h4>
                <p className='text-xs font-medium mt-0.5'>{employeeData?.designation}</p>
              </div>
            </div>
            <div className='mt-3'>
              <div className='flex gap-5'>
                <h4 className='text-sm md:text-base font-fontSemiBold inline-block px-2 border-b-2 border-theme-primary'>Employee Details</h4>
                <select className="text-sm" defaultValue="" onChange={handleHrAction}>
                  <option value="" disabled>
                    Select HR Action
                  </option>
                  <option value="Payroll">Payroll</option>
                  <option value="Leave Management">Leave Management</option>
                  <option value="Performance">Performance</option>
                </select>
              </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 items-start gap-5 mt-5'>

              <div className='shadow-md rounded-lg p-2 space-y-1'>
                <p className='font-fontSemiBold'>Gender</p>
                <p className='text-sm'>{employeeData?.gender}</p>
              </div>

              <div className='shadow-md rounded-lg p-2 space-y-1'>
                <p className='font-fontSemiBold'>Preformance</p>
                <p className='text-sm'>{getPercentage(employeeData?.performanceScore)}</p>
              </div>

              <div className='shadow-md rounded-lg p-2 space-y-1'>
                <p className='font-fontSemiBold'>Role</p>
                <p className='text-sm'>{employeeData?.role}</p>
              </div>

              <div className='shadow-md rounded-lg p-2 space-y-1'>
                <p className='font-fontSemiBold'>Salary</p>
                <p className='text-sm'>{getSalary(employeeData?.salaryLpa)}</p>
              </div>

              <div className='shadow-md rounded-lg p-2 space-y-1'>
                <p className='font-fontSemiBold'>Years of experience</p>
                <p className='text-sm'>{employeeData?.yearsOfExperience}</p>
              </div>

              <div className='shadow-md rounded-lg p-2 space-y-1'>
                <p className='font-fontSemiBold'>Date of joining</p>
                <p className='text-sm'>{getJoiningDate(employeeData?.yearsOfExperience)}</p>
              </div>


              <div className='shadow-md rounded-lg p-2 space-y-1'>
                <p className='font-fontSemiBold'>Email</p>
                <p className='text-sm'>{employeeData?.professionalEmail}</p>
              </div>

              <div className='shadow-md rounded-lg p-2 space-y-1'>
                <p className='font-fontSemiBold'>Phone</p>
                <p className='text-sm'>+91 9876543210</p>
              </div>

              <div className='shadow-md rounded-lg p-2 space-y-1'>
                <p className='font-fontSemiBold'>Work location</p>
                <p className='text-sm'>Chennai, India</p>
              </div>

              <div className='shadow-md rounded-lg p-2 space-y-1'>
                <p className='font-fontSemiBold'>Native location</p>
                <p className='text-sm'>Chennai, India</p>
              </div>

            </div>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  )
}

export default Employee