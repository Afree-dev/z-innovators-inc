import React, { useEffect, useState } from 'react'
import FetchError from "../components/FetchError";
import Loading from "../components/Loading";
import { Link } from 'react-router-dom';
import zcommerce from '../assets/images/projects/zcommerce.png';
import zrecipes from '../assets/images/projects/zrecipes.png';
import { FaExternalLinkAlt } from 'react-icons/fa';

const Products = () => {

  const API_URL = import.meta.env.VITE_API_URL;
  const PARAM = "products";
  const PRODUCTS_ENDIPOIT = `${API_URL}${PARAM}`

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(PRODUCTS_ENDIPOIT);
        if (!response.ok) throw new Error("Somthing went wrong!!!");
        const data = await response.json();
        setProduct(data)

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

  return (
    <div >
      {!loading ? (
        <div className='bg-white rounded-md shadow p-5'>
          <div className='grid grid-cols-1 md:grid-cols-2 items-start gap-5'>
            {product.map((item, idx) => (
              <div key={idx} className='space-y-2'>
                <Link to={item?.productUrl} className='block' target='_blank'>
                  <div className='rounded-md border overflow-hidden'>
                    <img className='aspect-video object-cover object-left-top hover:scale-105 transition-all select-none' src={item?.name === 'Z Commerce' ? zcommerce : zrecipes} alt="Product Image" />
                  </div>
                </Link>
                <div>
                  <Link className="flex items-center gap-2 underline underline-offset-2" to={item?.productUrl} target="_blank">
                    <h5 className="uppercase font-fontSemiBold">{item?.name}</h5>
                    <FaExternalLinkAlt />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default Products