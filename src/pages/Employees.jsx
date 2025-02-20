import React, { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { CgSpinnerTwo } from 'react-icons/cg';
import { BiMailSend } from "react-icons/bi";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import Loading from '../components/Loading';
import FetchError from '../components/FetchError';

const Employees = () => {

  const API_URL = import.meta.env.VITE_API_URL;
  const PARAM = "employeeData";
  const FINANCE_ENDIPOIT = `${API_URL}${PARAM}`

  const [employeeData, setEmployeeData] = useState(null);
  const [filterDatas, setFilterDatas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(FINANCE_ENDIPOIT);
        if (!response.ok) throw new Error("Error occured");
        const data = await response.json();
        setEmployeeData(data?.employees)
        setFilterDatas(data?.employees)
      } catch (err) {
        setError(true)
      } finally {
        setLoading(false)
      }
    })();
  }, [])

  const handleSearch = (e) => {
    let inputSearch = e.target.value.toLowerCase();
    
    const filteredData = employeeData.filter(el => 
      el?.name.toLowerCase().includes(inputSearch)
    );

    setFilterDatas(filteredData);
  };
  

  const tableTemplateName = (employee) => {
    return (
      <Link to={`/employee/${employee?.id}`}>
        {employee?.name}
      </Link>
    )
  }

  const tableTemplateImg = (employee) => {
    return (
      <Link to={`/employee/${employee?.id}`}>
        <img src={employee?.profileImage} alt='Employee Profile' title={employee?.name} className="size-10 rounded-full shadow-2 border" />
      </Link>
    )
  }

  const tableTemplateSalary = (employee) => {
    if (employee?.salaryLpa > 100000) {
      return (employee?.salaryLpa / 100000).toFixed(1) + ' LPA'
    } else {
      return (employee?.salaryLpa / 10000).toFixed(1) + ' K'
    }
  }

  const tableTemplateMail = (employee) => {
    return <a href={`mailto:${employee?.professionalEmail}`}><BiMailSend className='size-6' /></a>
  }

  const tableTemplateView = (employee) => {
    return (
      <Link to={`/employee/${employee.id}`} className='flex justify-center'>
        <FaArrowRightLong />
      </Link>
    )
  }

  if (error) {
    return (
      <FetchError />
    )
  }

  return (
    <>
      {!loading ? (
        <div>
          <div className='space-y-2'>
            <div className='flex justify-end'>
              <input onChange={(e) => handleSearch(e)} type="search" className='bg-transparent border border-theme-black rounded-md px-2 py-1 placeholder:text-sm' placeholder='Search by name' />
            </div>
            <DataTable stripedRows
              paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]}
              value={filterDatas}
              tableStyle={{ minWidth: '50rem', tableLayout: 'auto', scrollbarWidth: 'thin', whiteSpace: 'nowrap' }} >
              <Column header="EID" field="id" sortable className='text-center'></Column>
              <Column header="Profile" body={tableTemplateImg} style={{ width: '100px' }}></Column>
              <Column header="Name" body={tableTemplateName} style={{ whiteSpace: 'nowrap' }}></Column>
              <Column header="Gender" field="gender"></Column>
              <Column header="Score" field="performanceScore" sortable className='text-center'></Column>
              <Column header="Designation" field="designation" style={{ whiteSpace: 'initial' }}></Column>
              <Column header="Experience" field="yearsOfExperience" sortable className='text-center'></Column>
              <Column header="Salary" body={tableTemplateSalary}></Column>
              <Column header="Access Type" field="role" style={{ whiteSpace: 'nowrap' }}></Column>
              <Column header="Mail" body={tableTemplateMail}></Column>
              <Column header="View" body={tableTemplateView}></Column>
            </DataTable>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  )
}

export default Employees