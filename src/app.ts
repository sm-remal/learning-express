import express, { type Application, type Request, type Response } from "express"
import { pool } from "./db";
import { userRoute } from "./modules/user/user.route";
import { profileRoute } from "./modules/profile/profile.route";
import { authRouter } from "./modules/auth/auth.route";
import logger from "./middleware/logger";
import cookieParser from "cookie-parser"
import cors from "cors"
import globalErrorHandler from "./middleware/globalErrorHandler";


const app: Application = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(logger);
// const corsOptions = {
//   origin: 'http://localhost:3000',
// }
// app.use(cors(corsOptions));

app.use(cors({
    origin: 'http://localhost:3000',
}));

// Get request for server testing
app.get('/', (req: Request, res: Response) => {
    //   res.send('Hello World!')
    res.status(200).json({
        message: "Explore express with TypeScript",
        author: "Next Level"
    })
})

// API End-Points
app.use('/api/users', userRoute);
app.use('/api/profile', profileRoute);
app.use('/api/auth', authRouter);


// Global Error Handling Middleware
app.use(globalErrorHandler);


export default app;