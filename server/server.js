import express from 'express';
import cors from "cors";
import "dotenv/config";

const app = express();
const PORT = 3000;

//middleware
app.use(express.json());
app.use(cors());

// routes
app.get("/", (req,res) => {
    res.send("Hello World");
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})