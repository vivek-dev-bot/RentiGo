import Booking from "../model/Booking.js";
import Car from "../model/Car.js";


export const checkAvailability = async (car, pickupDate, returnDate) => {
    try {

        const bookings = await Booking.find({
            car,
            pickupDate: { $lte: returnDate },
            returnDate: { $gte: pickupDate },

        })
        return bookings.length === 0

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "failed to add car" })
    }
}


export const checkAvailabilityOfCar = async (req, res) => {
    try {

        const { location, pickupDate, returnDate } = req.body

        console.log("ssss", req.body);


        const cars = await Car.find({
            location, isAvailable: true
        })

        const availabileCarsPromise = cars.map(async (car) => {
            const isAvaliable = await checkAvailability(car._id, pickupDate, returnDate)

            return { ...car._doc, isAvaliable: isAvaliable }

        })

        let availabileCars = await Promise.all(availabileCarsPromise);
        availabileCars = availabileCars.filter(car => car.isAvaliable === true)

        res.json({ success: true, availabileCars, message: "car is available" })



    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "car is not available" })
    }
}

export const createBooking = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId, pickupDate, returnDate } = req.body;

    const isAvailable = await checkAvailability(carId, pickupDate, returnDate);

    if (!isAvailable) {
      return res.json({ success: false, message: "Car not available" });
    }

    const carData = await Car.findById(carId);

    if (!carData) {
      return res.json({ success: false, message: "Car not found" });
    }

    const picked = new Date(pickupDate);
    const returned = new Date(returnDate);

    const noOfDays = Math.max(
      1,
      Math.ceil((returned - picked) / (1000 * 60 * 60 * 24))
    );

    const price = noOfDays * carData.pricePerDay;

   await Booking.create({
   car: carId,
   owner: carData.owner,
   user: _id,
   pickupDate,
   returnDate: returnDate,
   price
});

    res.json({ success: true, message: "Booking created successfully" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Booking failed" });
  }
};


export const getUserBookings = async (req, res) => {
  try {

    const { _id } = req.user;

    const bookings = await Booking
      .find({ user: _id })
      .populate({ path: "car", select: "brand model image category pricePerDay" })
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to fetch bookings" });
  }
};

export const getOwnerBookings = async (req, res) => {
  try {

    if (req.user.role !== 'owner') {
      return res.json({ success: false, message: "Unauthorized" })
    }

    const bookings = await Booking.find().populate({path: 'car', match: { owner: req.user._id }})
      .populate({path: 'user', select: '-password'}).sort({ createdAt: -1 })

    // remove bookings where car is null (not owner's car)
    const ownerBookings = bookings.filter(b => b.car !== null)

    res.json({ success: true, message: "Owner booking data fetched", bookings: ownerBookings})

  } catch (error) {
    console.log(error.message)
    res.json({ success: false, message: "Failed to fetch owner booking" })
  }
}

export const chnageBookingStatus = async (req, res) => {
    try {

        const { _id } = req.user;
        const { bookingId, status } = req.body

        const booking = await Booking.findById(bookingId)

        if (booking.owner.toString() !== _id.toString()) {
            res.json({ success: false, message: "UNAUTHROZIED" })
        }

        booking.status = status;
        await booking.save();
        res.json({ success: true, message: "Booking status chnaged" })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "failed to change booking status" })
    }
}