import {Router} from 'express'
import destinationApi from '../controllers/destinationApi.js';
const destiRouter = Router();

destiRouter.get("/:city",destinationApi)

export default destiRouter
