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


app.use('/api/users', userRoute);





// Get all users 
app.get('/api/users', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT * FROM users
            `)
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result.rows,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving users",
            error: error,
        })
    }
})



// Get user by id
app.get('/api/users/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT * FROM users WHERE id = $1 
            `, [id]);

        // If user not found
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: {},
            })
        }

        res.status(200).json({
            success: true,
            message: "User retrieved successfully",
            data: result.rows[0],
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error,
        })
    }
})




// Update user by id
app.put('/api/users/:id', async (req: Request, res: Response) => {
    const {id} = req.params;
    const {name, password, age, is_active} = req.body;

    // console.log({id, name, password, age, is_active}); 

    try {
        const result = await pool.query(`
            UPDATE users  
                SET name = COALESCE($1, name), 
                password = COALESCE($2, password), 
                age = COALESCE($3, age), 
                is_active = COALESCE($4, is_active)
            WHERE id = $5  
            RETURNING *
            `, [name, password, age, is_active, id]);


            // If user not found
            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                })
            }

            res.status(200).json({
                success: true,
                message: "User Updated Successfully",
                data: result.rows[0],

            })

            console.log(result);
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error,
        })
    }
})



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