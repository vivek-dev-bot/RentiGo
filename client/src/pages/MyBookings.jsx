import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import Loader from '../components/Loader'

const MyBookings = () => {

  const { axios, user, currency, url } = useAppContext()

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchBookings = async () => {
    try {

      const { data } = await axios.get('/api/bookings/user')

      if (data.success) {
        setBookings(data.bookings)
      }

      console.log("BOOKINGS DATA 👉", data.bookings)

    } catch (error) {
      console.log(error)
    }

    setLoading(false)
  }

  useEffect(() => {
    user && fetchBookings()
  }, [user])

  if (loading) return <Loader />

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16'>

      <h1 className='text-3xl font-bold mb-8'>My Bookings</h1>

      {
        bookings.length === 0
          ? <p>No bookings found</p>
          :
          <div className='space-y-6'>
            {
              bookings.map((item) => {

                const car = item?.car

                return (
                  <div key={item._id}
                    className='flex gap-6 border p-4 rounded-xl shadow-sm'>

                    <img
                      src={car?.image}
                      className='w-40 h-28 object-cover rounded-lg'
                      alt=""
                    />

                    <div className='flex flex-col justify-between'>
                      <div>
                        <h2 className='text-xl font-semibold'>
                          {car?.brand} {car?.model}
                        </h2>

                        <p className='text-gray-500'>
                          {car?.category}
                        </p>

                        <p className='text-gray-500'>
                          {car?.location}
                        </p>

                      </div>

                      <div className='text-gray-500 text-sm'>
                        Pickup: {new Date(item.pickupDate).toDateString()}
                        <br />
                        Return: {new Date(item.returnDate).toDateString()}
                      </div>

                      <p className='font-semibold'>
                        {currency} {item.price}
                      </p>

                    </div>

                  </div>
                )
              })
            }
          </div>
      }

    </div>
  )
}

export default MyBookings