import {clerkClient} from "@clerk/express";

export const protectAdmin = async (req, res, next) => {
    try {
        const { userId } = req.auth;
        const user = await clerkClient.users.getUser(userId);
        if(user.privateMetadata.role !== "admin"){
            return res.json({success: false, message: "Not authorized"})
        }
        next()
    } catch (error) {
        console.error('Error occurred while protecting admin route:', error.message);
        res.status(500).json({success: false, message: "Internal server error"})
    }
}