import { Inngest } from "inngest";
import User from "../models/user_model.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

// inngest function to save data to the db
const syncUserData = inngest.createFunction(
    {id: "sync-user-from-clerk",
    triggers: [{event: "clerk/user.created"}],},
    async ({event})=> {
        const {id, first_name, last_name, email_addresses, image_url} = event.data
        const email = email_addresses?.[0]?.email_address;
        if (!email){
            console.error("No email address found for user with id:", id);
            return;
        }
        const userData = {
            _id: id,
            email,
            name: [first_name, last_name].filter(Boolean).join(" ")|| "Unknown",
            image: image_url || ""
        }
        await User.create(userData)
    }
)

// function to delete user from db
const deleteUserData = inngest.createFunction(
    {id: "delete-user-from-clerk",
    triggers: [{event: "clerk/user.deleted"}],},
    async ({event})=> {
        const {id} = event.data
        await User.findByIdAndDelete({id})
    }
)

// function to update user data in db
const updateUserData = inngest.createFunction(
    {id: "update-user-from-clerk",
        triggers: [{event: "clerk/user.updated"}],},
        async ({event})=> {
            const {id, first_name, last_name, email_addresses, image_url} = event.data
            const email = email_addresses?.[0]?.email_address;
            if (!email){
                console.error("No email address found for user with id:", id);
                return;
            }
            const userData = {
                _id: id,
                email,
                name: [first_name, last_name].filter(Boolean).join(" ")|| "Unknown",
                image: image_url || ""
            }
            await User.findByIdAndUpdate( id, userData )
            }
        
    )

export const functions = [syncUserData, deleteUserData, updateUserData];