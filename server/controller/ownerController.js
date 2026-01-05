import imagekit from "../Config/imageKit.js";
import User from "../model/User.js";
import fs from 'fs'
import Car from "../model/Car.js"; 
import Booking from "../model/Booking.js";



export const changeRoleToOwner = async (req, res) => {
    try {
        const {_id} = req.user;
        await User.findByIdAndUpdate(_id, {role:"owner"})
        res.json({success: true, message:"Role changed to owner"})

    } catch (error) {
        console.log(error.message);
         res.json({success: false, message:"Role chnage failed"})
    }
}


export const addCar = async (req, res) => {
  try {

    const { _id } = req.user;

    if (!req.body.carData) {
      return res.json({ success:false, message:"carData missing" })
    }

    const car = JSON.parse(req.body.carData)

    if (!req.file) {
      return res.json({ success:false, message:"Image file missing" })
    }

    const imageFile = req.file

    const fileBuffer = fs.readFileSync(imageFile.path)

    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/cars"
    })

    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { width: "1290" },
        { quality: "auto" },
        { format: "webp" }
      ]
    })

    await Car.create({
      ...car,
      owner: _id,
      image: optimizedImageUrl
    })

    res.json({ success: true, message: "Car added successfully" })

  } catch (error) {
    console.log(error)
    res.json({ success:false, message:error.message })
  }
}


export const getOwnerCars = async(req, res) => {
    try {
        const{_id} = req.user;
        const cars = await Car.find({owner : _id})
         res.json({success: true, cars, message:"car get"})

        
    } catch (error) {
         console.log(error.message);
        res.json({success: false, message:"failed to add car"})
    }
}

export const toggleCarAvailability = async(req, res) => {
    try {
        const{_id} = req.user;
        const {carId} = req.body
        const car = await Car.findById(carId) 

        if (car.owner.toString() != _id.toString()) {
            return res.json({success: false, message:"Unauthroried accesss denied"})
        }

        car.isAvaliable = !car.isAvaliable
        await car.save();


         res.json({success: true, car, message:"Car toggled successfully"})

        
    } catch (error) {
         console.log(error.message);
        res.json({success: false, message:"failed to toggle car"})
    }
}

export const deleteCar = async (req, res) => {
    try {

        const { _id } = req.user;
        const { carId } = req.body;

        const car = await Car.findById(carId);

        if (!car) {
            return res.json({ success: false, message: "Car not found" });
        }

        if (car.owner.toString() !== _id.toString()) {
            return res.json({ success: false, message: "Unauthorized" });
        }
        await Car.findByIdAndDelete(carId);

        res.json({ success: true, message: "Car deleted successfully" });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "Failed to delete car" });
    }
}
 


export const getDashboardData = async(req, res) => {
    try {
        const{_id, role} = req.user;
        
        if (role !== 'owner') {
            return  res.json({success: false, message:"Not a owner access denied"})
        }

        const cars = await Car.find({owner: _id})
        const bookings =  await Booking.find({owner: _id}).populate('car')
        .sort({createdAr: -1})

        const pendingBookings = await Booking.find({owner: _id, status:'pending' })
        const completedBookigns = await Booking.find({owner: _id, status:'confirmed' })

        const monthlyRevenue = bookings.slice().filter(booking => booking.status === 'confirmed').reduce((acc, booking) => acc + booking.price, 0)

        const dashboardData = {
                totalCars: cars.length,
                totalBookings : bookings.length,
                pendingbookings : pendingBookings.length,
                completedBookigns : completedBookigns.length,
                recentBookings : bookings.slice(0,3), monthlyRevenue
        }

         res.json({success: true, message:"Got dashboard data successfully", dashboardData})

        
    } catch (error) {
         console.log(error.message);
        res.json({success: false, message:"Dashbord data can't be access"})
    }
}

