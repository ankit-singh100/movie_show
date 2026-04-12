import express from 'express';
import { addShow, getNowPlayingMovie, getShow, getShows } from '../controllers/show_controller.js';
import { protectAdmin } from '../middleware/auth.js';

const showRouter = express.Router();

showRouter.get("/now-playing",protectAdmin, getNowPlayingMovie)
showRouter.post("/add-show",protectAdmin, addShow)
showRouter.get("/all", getShows)
showRouter.get("/:movieId", getShow)


export default showRouter;
