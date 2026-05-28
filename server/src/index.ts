import dotenv from "dotenv"
import { ENV } from "./config/env.config"
import express , {NextFunction, Request, Response} from "express"

import cors from "cors"
import { HTTPSTATUS } from "./config/http.config"
import { errorHandler } from "./middlewares/errorHandler"
import { asyncHandler } from "./middlewares/asyncHandler"
import connectDB from "./config/database.config"
import authRoutes from "./routes/auth.routes"

dotenv.config()


const app = express()

app.use(express.json());

const BASE_PATH = ENV.BASE_PATH || "/api"

app.use(express.urlencoded({extended : true}));
app.use(
    cors({
        origin : ENV.FRONTEND_ORIGIN,
        credentials: true,

    })
);

app.get("/", asyncHandler(async(req: Request, res : Response, next : NextFunction) => {
    res.status(HTTPSTATUS.OK).json({
        message : "Welcome to the finance platform"
    })
})
);

app.use(`${BASE_PATH}/auth`, authRoutes);


app.use(errorHandler);

app.listen(ENV.PORT, async() => {
    await connectDB();
    console.log(`Server running on port ${ENV.PORT}`)
})