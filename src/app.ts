import express, { type Application, type Request, type Response } from "express"
import { pool } from "./db";
import { userRoute } from "./modules/user/user.route";
import { profileRoute } from "./modules/profile/profile.route";
import { authRouter } from "./modules/auth/auth.route";
import logger from "./middleware/logger";
const app: Application = express();

// Middleware
app.use(express.json());
app.use(logger);

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

export default app;