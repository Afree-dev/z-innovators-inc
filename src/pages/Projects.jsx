import React, { useEffect, useState } from 'react'
import Loading from '../components/Loading'
import FetchError from '../components/FetchError'
import { GiProgression } from 'react-icons/gi';
import { HiOutlineCheckBadge } from 'react-icons/hi2';

const Projects = () => {

  const API_URL = import.meta.env.VITE_API_URL;
  const PARAM = "projects";
  const PROJECTS_ENDIPOIT = `${API_URL}${PARAM}`

  const [projects, setProjects] = useState(null);
  const [copyData, setCopyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(PROJECTS_ENDIPOIT);
        if (!response.ok) throw new Error("Somthing went wrong!!!");
        const data = await response.json();
        setCopyData(data?.projectStatuses)
        setProjects(data)
      } catch (err) {
        setError(true)
      } finally {
        setLoading(false)
      }

    })();
  }, [])

  if (error) {
    return (
      <FetchError />
    )
  }

  function handleSortAction (e) {
    const filteredData = projects?.projectStatuses.filter((el) => (
      el?.status.includes(e.target.value || '')
    ))

    setCopyData(filteredData)
  }

  function getStatus (status) {
    return (
      <span className={`text-xs py-0.5 px-2 rounded-full ${status === 'Not Started' ? 'bg-theme-error/20 text-theme-error' : status === 'In Progress' ? 'bg-theme-primary/20 text-theme-primary' : 'bg-theme-green/20 text-theme-green' }`}>
        {status}
      </span>
    )
  }

  return (
    <>
      {!loading ? (
        <div className='bg-white rounded-md shadow p-5 space-y-5 md:space-y-10'>
          <div>
            <div className='flex justify-between gap-5 items-center mb-2 pb-2 text-theme-primary border-b border-gray-300'>
              <h1 className='font-fontBold'>Project Overview</h1>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 items-start gap-5 mt-5'>

              <div className='shadow-md rounded-lg p-2 space-y-2'>
                <p className='font-fontSemiBold flex justify-between items-center'><span>Active Projects</span> <GiProgression className='text-theme-primary size-6' /></p>
                <p className='text-2xl font-fontBold text-theme-primary'>{projects?.activeProjects}</p>
                <p className='text-sm text-gray-400'>3 projects added this month</p>
              </div>

              <div className='shadow-md rounded-lg p-2 space-y-2'>
                <p className='font-fontSemiBold flex justify-between items-center'><span>Completed Projects</span> <HiOutlineCheckBadge className='text-theme-green size-6' /></p>
                <p className='text-2xl font-fontBold text-theme-green'>{projects?.completedProjects}</p>
                <p className='text-sm text-gray-400'>5 completed this month</p>
              </div>
            </div>
          </div>
          <div>
            <div className='flex justify-between gap-5 items-center my-2 py-2 text-theme-primary border-b border-gray-300 bg-white z-10 sticky top-0'>
              <h1 className='font-fontBold'>Project Details</h1>

              <div className='text-right'>
                <select className="text-sm" defaultValue="" onChange={handleSortAction}>
                  <option value="">All</option>
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 items-start gap-5 mt-5'>
              {copyData.map((item, idx) => (
                <div key={idx} className='shadow-md rounded-lg p-3'>
                  <div className='flex gap-2'>
                    <div className='font-fontSemiBold'>{item?.name}</div>
                  </div>

                  <div className='flex gap-2 mt-1'>
                    <div>{getStatus(item?.status)}</div>
                  </div>

                  <div className='mt-5'>
                    <div className='flex gap-2 justify-between mb-1'>Completion: <span className='shrink-0 font-fontSemiBold'>{item?.completion} %</span></div>
                    <div className='flex-1 flex items-center gap-2'><progress value={item?.completion} max={100} className={`text-theme-primary w-full`}></progress></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  )
}

export default Projects