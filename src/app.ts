import express, { type Application, type Request, type Response } from "express"
import { pool } from "./db";
import { userRoute } from "./modules/user/user.route";
const app: Application = express();

// Middleware
app.use(express.json());

// Get request
app.get('/', (req: Request, res: Response) => {
    //   res.send('Hello World!')
    res.status(200).json({
        message: "Explore express with TypeScript",
        author: "Next Level"
    })
})

// User routes
app.use('/api/users', userRoute);

// Delete user by id
app.delete('/api/users/:id', async (req: Request, res: Response) => {
    const {id} = req.params;

    try {
        const result = await pool.query(`
            DELETE FROM users WHERE id = $1 RETURNING *
            `,[id]);

            if (result.rowCount === 0){
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                })
            }
            
            res.status(200).json({
                success: true,
                message: "User Deleted Successfully",
                data: {},
            })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error,
        })
    }
})

export default app;