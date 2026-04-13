import { clerkClient } from "@clerk/express";
import Booking from "../models/booking_model.js";
import Movie from "../models/movie_model.js";

// get user booking
export const getUserBookings = async (req, res) => {
    try {
        const user = req.auth().userId;
        const bookings = await Booking.find({user}).populate({
            path: "show",
            populate: {path: "movie"}
        }).sort({ createdAt: -1});
        res.json({success: true, bookings});

    } catch (error) {
        console.error(error.message);
        res.json({success: false, message: error.message})
    }
}

// update favourite movie in Clerk
export const updateFavouriteMovie = async (req, res) => {
    try {
        const { movieId } = req.body;
        const userId = req.auth().userId;
        const user = await clerkClient.users.getUser(userId);
        if(!user.privateMetadata.favorites){
            user.privateMetadata.favorites = [];
        }

        if(!user.privateMetadata.favorites.include(movieId)){
            user.privateMetadata.favorites.push(movieId);
        }else{
            user.privateMetadata.favorites = user.privateMetadata.favorites.filter(item => item !== movieId)
        }

        await clerkClient.users.updateUserMetadata(userId, {privateMetadata: user.privateMetadata})
        res.json({success: true, message: "Movie updated in favorites"})
    } catch (error) {
        console.error(error.message);
        res.json({success: false, message: error.message})
    }
}

export const getFavouriteMovies = async (req, res) => {
    try {
        const user = await clerkClient.users.getUser(req.auth().userId);
        const favorites = user.privateMetadata.favorites;

        const movies = await Movie.find({_id: {$in: favorites}})
        res.json({success: true, movies});

    } catch (error) {
        console.error(error.message);
        res.json({success: false, message: error.message})
    }
}