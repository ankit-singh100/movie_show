import Show from "../models/show_model.js"
import Booking from "../models/booking_model.js";

// function to check availability of selected seats
const checkSeatAvailability = async (showId, selectedSeats) => {
    try {
        const showData = await Show.findById(showId);
        if(!showData){
            return false;
        }
        const bookedSeats = showData.occupiedSeats;

        const isAnySeatBooked = selectedSeats.some(seat => occupiedSeats[seat])
        return !isAnySeatBooked;
    } catch (error) {
        console.error(error.message);
        return false;
    }
}

export const createBooking = async (req, res) => {
    try {
        const {userId} = req.auth();
        const { showId , selectedSeats} = req.body;
        const { origin } = req.headers;

        // cheking seat availability
        const isAvailable = await checkSeatAvailability(showId, selectedSeats);
        if(!isAvailable){
            return res.json({success: false, message: "Selected seats are not available"})
        }

        // get the details of the show
        const showData = await Show.findById(showId).populate("movie");

        // create a new booking
        const bookingData = await Booking.create({
            user: userId,
            show: showId,
            amount:showData.showPrice * selectedSeats.length,
            bookedSeats: selectedSeats
        })
        selectedSeats.map((seat) => {
            showData.occupiedSeats[seat] = userId;
        })
        showData.markModified("occupiedSeats");
        await showData.save();

        //  Payment gateway later

        res.json({success: true, message: "Booking successful", bookingId: bookingData._id})
    } catch (error) {
        console.error(error.message);
        res.json({success: false, message: error.message})
    }
}

export const getOccupiedSeats = async (req, res) => {
    try {
        const { showId } = req.params;
        const showData = await Show.findById(showId);
        const occupiedSeats = Object.keys(showData.occupiedSeats);
        res.json({success: true, occupiedSeats});
    } catch (error) {
        console.error(error.message);
        res.json({success: false, message: error.message})
    }
}