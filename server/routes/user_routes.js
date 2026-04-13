import express from "express";
import { getFavouriteMovies, getUserBookings, updateFavouriteMovie } from "../controllers/user_controller.js";

const userRouter = express.Router();

userRouter.get("/bookings", getUserBookings);
userRouter.post("/update-favourite", updateFavouriteMovie);
userRouter.get("/favourites", getFavouriteMovies);

export default userRouter;