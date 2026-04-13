import express from 'express';
import cors from "cors";
import "dotenv/config";
import connectDB from './config/db.js';
import { serve } from "inngest/express";
import {inngest, functions} from "./inngest/index.js";
import {clerkMiddleware} from "@clerk/express";
import showRouter from './routes/show_routes.js';
import bookingRouter from './routes/booking_router.js';
import adminRouter from './routes/admin_routes.js';
import userRouter from './routes/user_routes.js';

const app = express();
const PORT = 3000;

await connectDB()

//middleware
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

// routes
app.get("/", (req,res) => {
    res.send("Hello World");
})

app.use("/api/inngest", serve({client: inngest, functions}))
app.use("/api/show", showRouter)
app.use("/api/booking", bookingRouter);
app.use("/api/admin", adminRouter)
app.use("/api/user", userRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});