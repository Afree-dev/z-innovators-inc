import React, { useEffect, useState } from 'react'
import { json } from 'react-router-dom';
import { Chart } from 'primereact/chart';
import { CgSpinnerTwo } from 'react-icons/cg';
import Loading from '../components/Loading';
import FetchError from '../components/FetchError';

const AdminDashboard = () => {

  const API_URL = import.meta.env.VITE_API_URL;
  const PARAM = "financials";
  const FINANCE_ENDIPOIT = `${API_URL}${PARAM}`
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [chartDataBar, setChartDataBar] = useState({});
  const [chartOptionsBar, setChartOptionsBar] = useState({});
  const [chartDataDoughnut, setChartDataDoughnut] = useState({});
  const [chartOptionsDoughnut, setChartOptionsDoughnut] = useState({});

  useEffect(() => {
    if (!data) {
      (async () => {
        try {
          const response = await fetch(FINANCE_ENDIPOIT)
          if (!response.ok) throw new Error("Somthing Went wrong");
          const respData = await response.json();
          setData(respData)
        } catch (err) {
          setError(true)
        } finally {
          setLoading(false)
        }

      })();
    }
  }, [])

  useEffect(() => {
    if (data) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
      let BarChartData = [], doughnutLabel = [], doughnutValue = [];

      for (let key in data) {
        // BarChart dataset
        BarChartData.push({
          labels: data[key]?.map(el => (String(el?.month)).substring(0, 2)),
          datasets: [
            {
              label: key.toUpperCase(),
              backgroundColor: documentStyle.getPropertyValue('--blue-500'),
              borderColor: documentStyle.getPropertyValue('--blue-500'),
              data: data[key]?.map(el => el?.amount)
            }
          ]
        });

        // DoughnutChart values
        doughnutLabel.push(key);
        doughnutValue.push(data[key]?.reduce((acc, { amount }) => acc + amount, 0))
      }

      // BarChart options
      const BarChartOptions = {
        maintainAspectRatio: false,
        aspectRatio: 1,
        plugins: {
          legend: {
            labels: {
              fontColor: textColor
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
              font: {
                weight: 500
              }
            },
            grid: {
              display: false,
              drawBorder: false
            }
          },
          y: {
            ticks: {
              color: textColorSecondary
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false
            }
          }
        }
      };

      // DoughnutChart dataset and options
      const documentStyleDoughnut = getComputedStyle(document.documentElement);
      const doughNutData = {
        labels: doughnutLabel?.map(el => el.toUpperCase()),
        datasets: [
          {
            data: doughnutValue?.map(el => el),
            backgroundColor: [
              documentStyleDoughnut.getPropertyValue('--blue-500'),
              documentStyleDoughnut.getPropertyValue('--yellow-500'),
              documentStyleDoughnut.getPropertyValue('--green-500')
            ],
            hoverBackgroundColor: [
              documentStyleDoughnut.getPropertyValue('--blue-400'),
              documentStyleDoughnut.getPropertyValue('--yellow-400'),
              documentStyleDoughnut.getPropertyValue('--green-400')
            ]
          }
        ]
      };
      const doughNutOptions = {
        cutout: '60%',
        radius: 120,
      };

      setChartDataBar(BarChartData);
      setChartOptionsBar(BarChartOptions);
      setChartDataDoughnut(doughNutData);
      setChartOptionsDoughnut(doughNutOptions);
    }
  }, [data])

  const formatAmount = (amount) => {
    if (amount >= 1000) {
      return (amount / 1000) + 'K';
    }
    return amount.toString();
  };

  if (error) {
    return (
      <FetchError />
    )
  }

  return (
    <>
      {!loading ? (
        <div className='space-y-10'>
          <div className='top-cards'>
            <div className='grid md:grid-cols-2 xl:grid-cols-4 gap-5'>
              <div className='p-3 bg-white rounded-lg'>
                {data?.expenses?.filter(el => el?.month === currentMonth)
                  .map((item, index) => (
                    <div key={index}>
                      <div className='flex justify-between gap-1 items-start pb-2 mb-2 border-b'>
                        <div className='bg-theme-primary text-theme-white inline-block  rounded-xl -mt-5'>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xmlSpace="preserve"
                            width={45}
                            height={45}
                            viewBox="0 0 64 64"
                            className='fill-white p-2'
                          >
                            <path
                              d="M41 43c0-1.731 0-7 5-7h10v-6c0-2.757-2.243-5-5-5H8c-2.757 0-5 2.243-5 5v26c0 2.757 2.243 5 5 5h43c2.757 0 5-2.243 5-5v-6H46c-5 0-5-5.269-5-7zm2-20v-6.062c0-1.033-.539-1.97-1.442-2.506a3.027 3.027 0 0 0-3.021-.054L21.246 23z"
                              data-original="#ffffff"
                            />
                            <circle cx={49} cy={43} r={2} data-original="#ffffff" />
                            <path
                              d="M34 14.406v-4.257a3.11 3.11 0 0 0-1.811-2.884c-1.062-.482-2.226-.304-3.114.475L11.659 23h5.106zM58 38H46c-1.801 0-3 .851-3 5s1.199 5 3 5h12c1.654 0 3-1.346 3-3v-4c0-1.654-1.346-3-3-3zm-9 9c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4zM61.779 8.798l-4.6-6.188a1.491 1.491 0 0 0-2.394.001l-4.572 6.157a.721.721 0 0 0 .51 1.232h2.258a7.212 7.212 0 0 1-3.357 7.625L49 18l4 3 .176-.117A13.082 13.082 0 0 0 59 10h2.281a.704.704 0 0 0 .498-1.202z"
                              data-original="#ffffff"
                            />
                          </svg>
                        </div>

                        <div className='text-right'>
                          <h2 className='font-fontBold'>Expense</h2>
                          <h6 className='text-sm mt-1'>{item?.month} - {formatAmount(item?.amount)}</h6>
                        </div>
                      </div>
                      <div>
                        <p className='text-sm'>
                          <span className='text-theme-error font-fontSemiBold'>+10% </span>
                          than last month
                        </p>
                      </div>
                    </div>
                  ))
                }
              </div>

              <div className='p-3 bg-white rounded-lg'>
                {data?.revenue?.filter(el => el?.month === currentMonth)
                  .map((item, index) => (
                    <div key={index}>
                      <div className='flex justify-between gap-1 items-start pb-2 mb-2 border-b'>
                        <div className='bg-theme-primary text-theme-white inline-block  rounded-xl -mt-5'>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={45}
                            height={45}
                            viewBox="0 0 48 48"
                            className='fill-white p-2'
                          >
                            <title>{"currency-revenue"}</title>
                            <g data-name="Layer 2">
                              <path fill="none" d="M0 0h48v48H0z" data-name="invisible box" />
                              <g data-name="Q3 icons">
                                <path d="M44 7.1V14a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2.3 2.1 2.1 0 0 1 2.1-1.7h2.3A18 18 0 0 0 6.1 22.2a2 2 0 0 1-2 1.8 2 2 0 0 1-2-2.2A22 22 0 0 1 40 8.9V7a2 2 0 0 1 2.3-2A2.1 2.1 0 0 1 44 7.1ZM4 40.9V34a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2.3 2.1 2.1 0 0 1-2.1 1.7h-2.3a18 18 0 0 0 31.3-10.2 2 2 0 0 1 2-1.8 2 2 0 0 1 2 2.2A22 22 0 0 1 8 39.1V41a2 2 0 0 1-2.3 2A2.1 2.1 0 0 1 4 40.9Z" />
                                <path d="M24.7 22c-3.5-.7-3.5-1.3-3.5-1.8s.2-.6.5-.9a3.4 3.4 0 0 1 1.8-.4 6.3 6.3 0 0 1 3.3.9 1.8 1.8 0 0 0 2.7-.5 1.9 1.9 0 0 0-.4-2.8 9.1 9.1 0 0 0-3.1-1.2V13a2 2 0 0 0-4 0v2.2c-3 .5-5 2.5-5 5.2s3.3 4.9 6.5 5.5 3.3 1.3 3.3 1.8-1.1 1.4-2.5 1.4a6.7 6.7 0 0 1-4.1-1.3 2 2 0 0 0-2.8.6 1.8 1.8 0 0 0 .3 2.6 10.9 10.9 0 0 0 4.3 1.8V35a2 2 0 0 0 4 0v-2.2a6.3 6.3 0 0 0 3-1.3 4.9 4.9 0 0 0 2-4c0-3.7-3.4-4.9-6.3-5.5Z" />
                              </g>
                            </g>
                          </svg>
                        </div>
                        <div className='text-right'>
                          <h2 className='font-fontBold'>Revenue</h2>
                          <h6 className='text-sm mt-1'>{item?.month} - {formatAmount(item?.amount)}</h6>
                        </div>
                      </div>
                      <div>
                        <p className='text-sm'>
                          <span className='text-theme-green font-fontSemiBold'>+6% </span>
                          than last month
                        </p>
                      </div>
                    </div>
                  ))
                }
              </div>

              <div className='p-3 bg-white rounded-lg'>
                {data?.netIncome?.filter(el => el?.month === currentMonth)
                  ?.map((item, index) => (
                    <div key={index}>
                      <div className='flex justify-between gap-1 items-start pb-2 mb-2 border-b'>
                        <div className='bg-theme-primary text-theme-white inline-block  rounded-xl -mt-5'>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xmlSpace="preserve"
                            width={45}
                            height={45}
                            viewBox="0 0 512 512"
                            className='fill-white p-2'
                          >
                            <path
                              d="M305.409 253.32c69.84 0 126.65-56.82 126.65-126.66S375.249 0 305.409 0s-126.66 56.82-126.66 126.66 56.82 126.66 126.66 126.66zm-15-201.11v-3.44c0-8.29 6.71-15 15-15 8.28 0 15 6.71 15 15v3.46c17.85 3.83 31.28 19.73 31.28 38.71 0 8.28-6.72 15-15 15-8.29 0-15-6.72-15-15 0-5.29-4.31-9.6-9.6-9.6h-13.45c-5.29 0-9.6 4.31-9.6 9.6a9.61 9.61 0 0 0 3.89 7.71l12.48 9.24 30.32 22.44c9.96 7.37 15.96 19.16 16.04 31.56v.14c.07 10.58-3.98 20.56-11.42 28.09-5.52 5.59-12.42 9.34-19.94 10.92v3.51c0 8.29-6.72 15-15 15-8.29 0-15-6.71-15-15v-3.46c-7.32-1.56-14.05-5.16-19.49-10.54-7.53-7.43-11.71-17.35-11.77-27.93-.05-8.28 6.62-15.04 14.9-15.09h.1c8.24 0 14.95 6.66 15 14.91a9.58 9.58 0 0 0 9.65 9.54c8.288-.05 5.201-.032 13.43-.08 5.324-.042 9.581-4.363 9.54-9.67v-.14c-.02-3-1.47-5.86-3.89-7.65l-12.47-9.23-30.33-22.44c-10.04-7.44-16.04-19.34-16.04-31.83 0-19.02 13.47-34.93 31.37-38.73zM100.188 325.392c-3.845-6.666-12.386-8.985-19.093-5.116l-70.558 40.73c-6.681 3.867-8.973 12.412-5.116 19.102L77.535 505.01c3.86 6.679 12.4 8.973 19.093 5.116l70.558-40.74c6.691-3.858 8.974-12.403 5.116-19.093zm404.29-24.932c-6.79-9.43-19.93-11.56-29.35-4.77-28.58 20.59-83.46 60.13-87.82 63.28a53 53 0 0 1-6.32 4.63c-8.63 5.43-18.64 8.33-29.09 8.33h-71.85c-8.28 0-15-6.71-15-15 0-8.3 6.73-15 15-15h76.84c11.29 0 20.33-9.4 19.86-20.71-.44-10.73-9.6-19.05-20.34-19.05h-58.49c-3.96-4.19-8.3-8.03-12.95-11.46-15.99-11.79-35.75-18.76-57.14-18.76-38.03 0-75.87 23.96-91.56 55.94l61.36 106.27h115.1c22.6 0 44.86-5.78 64.45-17.05 6.79-3.9 14.06-8.59 21.94-14.25 33.02-23.72 100.53-73 100.58-73.03 9.44-6.78 11.58-19.94 4.78-29.37z"
                              data-original="#ffffff"
                            />
                          </svg>
                        </div>

                        <div className='text-right'>
                          <h2 className='font-fontBold'>Net Income</h2>
                          <h6 className='text-sm mt-1'>{item?.month} - {formatAmount(item?.amount)}</h6>
                        </div>
                      </div>
                      <div>
                        <p className='text-sm'>
                          <span className='text-theme-error font-fontSemiBold'>-2% </span>
                          than last month
                        </p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
          <div className='charts'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5'>
              <div className='chart-card bg-white shadow rounded-lg p-2 flex flex-col'>
                <div className='mb-2'>
                  <Chart className='w-full h-full aspect-video' type="bar" data={chartDataBar[0]} options={chartOptionsBar} />
                </div>
                <div className='mt-auto pt-2 border-t'>
                  <h3 className='font-fontSemiBold'>Expense</h3>
                </div>
              </div>

              <div className='chart-card bg-white shadow rounded-lg p-2 flex flex-col'>
                <div className='mb-2'>
                  <Chart className='w-full h-full aspect-video' type="bar" data={chartDataBar[1]} options={chartOptionsBar} />
                </div>
                <div className='mt-auto pt-2 border-t'>
                  <h3 className='font-fontSemiBold'>Revenue</h3>
                </div>
              </div>

              <div className='chart-card bg-white shadow rounded-lg p-2 flex flex-col'>
                <div className='mb-2'>
                  <Chart className='w-full h-full aspect-video' type="bar" data={chartDataBar[2]} options={chartOptionsBar} />
                </div>
                <div className='mt-auto pt-2 border-t'>
                  <h3 className='font-fontSemiBold'>Net Income</h3>
                </div>
              </div>

              <div className='chart-card bg-white shadow rounded-lg p-2 flex flex-col'>
                <div className='mb-2'>
                  <Chart className='w-full h-[300px] flex justify-center' type="doughnut" data={chartDataDoughnut} options={chartOptionsDoughnut} />
                </div>
                <div className='mt-auto pt-2 border-t'>
                  <h3 className='font-fontSemiBold'>Overall</h3>
                </div>
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

export default AdminDashboard