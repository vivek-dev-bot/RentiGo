import React, { useEffect, useState } from 'react'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ManageBookings = () => {

  const { axios, currency, url } = useAppContext()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchOwnerBookings = async () => {
    try {
      setLoading(true)

      const { data } = await axios.get('/api/bookings/owner')

      if (data.success) {
        setBookings(data.bookings || [])
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const changeBookingStatus = async (bookingId, status) => {
    try {

      const { data } = await axios.post('/api/bookings/change-status', {
        bookingId,
        status
      })

      if (data.success) {
        toast.success(data.message)

        setBookings(prev =>
          prev.map(b =>
            b._id === bookingId ? { ...b, status } : b
          )
        )

      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchOwnerBookings()
  }, [])

  if (loading) {
    return <p className='p-10'>Loading bookings...</p>
  }

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>

      <Title
        title="Manage Bookings"
        subTitle="Track all customer bookings and manage their status"
      />

      <div className='max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>

        <table className='w-full border-collapse text-left text-sm text-gray-600'>

          <thead className='text-gray-500 bg-gray-50'>
            <tr>
              <th className='p-3 font-medium'>Car</th>
              <th className='p-3 font-medium max-md:hidden'>Date Range</th>
              <th className='p-3 font-medium'>Total</th>
              <th className='p-3 font-medium max-md:hidden'>Payment</th>
              <th className='p-3 font-medium'>Actions</th>
            </tr>
          </thead>

          <tbody>

            {bookings.length === 0 && (
              <tr>
                <td colSpan={5} className='text-center p-6'>
                  No bookings found
                </td>
              </tr>
            )}

            {bookings.map((booking) => {

              const pickup = booking?.pickupDate
                ? new Date(booking.pickupDate).toLocaleDateString()
                : 'NA'

              const ret = booking?.returnDate
                ? new Date(booking.returnDate).toLocaleDateString()
                : 'NA'

              return (
                <tr key={booking._id} className='border-t border-borderColor'>

                  <td className='p-3 flex items-center gap-3'>

                    <img
                      src={booking?.car?.image
                        ? `${url}/${booking.car.image}`
                        : '/no-car.png'}
                      alt="car"
                      className='h-12 w-12 rounded-md object-cover'
                    />

                    <p className='font-medium max-md:hidden'>
                      {booking?.car?.brand || 'Unknown'} {booking?.car?.model || ''}
                    </p>

                  </td>

                  <td className='p-3 max-md:hidden'>
                    {pickup} to {ret}
                  </td>

                  <td className='p-3'>
                    {currency}{booking?.price || 0}
                  </td>

                  <td className='p-3 max-md:hidden'>
                    <span className='bg-gray-100 px-3 py-1 rounded-full text-xs'>
                      {booking?.paymentMethod || 'Offline'}
                    </span>
                  </td>

                  <td className='p-3'>

                    {booking.status === 'pending' ? (

                      <select
                        onChange={e =>
                          changeBookingStatus(booking._id, e.target.value)
                        }
                        value={booking.status}
                        className='px-2 py-1.5 border border-borderColor rounded-md outline-none'
                      >
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="confirmed">Confirmed</option>
                      </select>

                    ) : (

                      <span className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {booking.status}
                      </span>

                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageBookings