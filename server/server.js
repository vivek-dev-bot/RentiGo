import express from 'express'
import "dotenv/config";
import cors from 'cors'
import connectDB from './Config/db.js';
import userRouter from './rountes/userRoutes.js';
import ownerRouter from './rountes/ownerRoutes.js';
import bookingRounter from './rountes/bookingRoutes.js';


const app = express()
await connectDB()

app.use(cors())
app.use(express.json());

app.get('/', (req, res) => res.send("Server is running"))
app.use('/api/user', userRouter)
app.use('/api/owner', ownerRouter)
app.use('/api/bookings', bookingRounter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server is running in port ${PORT}`))