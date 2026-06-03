import express, { type Application, type Request, type Response } from "express"
import { Pool } from "pg"
const app: Application = express()
const port = 5000

// Middleware
app.use(express.json());

// Connection to PostgreSQL
const pool = new Pool({
    connectionString: "postgresql://neondb_owner:npg_qBbu6zIUWTS4@ep-young-dust-aq76qs2o.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require"
})


// Database Table
const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(20) NOT NULL,
                email VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(20) NOT NULL,
                is_active BOOLEAN DEFAULT true,
                age INT,

                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
      `)

        console.log("Table created successfully");

    } catch (error) {
        console.log(error);
    }
}

initDB();


// Get request
app.get('/', (req: Request, res: Response) => {
    //   res.send('Hello World!')
    res.status(200).json({
        message: "Explore express with TypeScript",
        author: "Next Level"
    })
})


// post request
app.post('/api/users', async (req: Request, res: Response) => {
    // console.log(req.body)
    const { name, email, password, age } = req.body;

    try {
        const result = await pool.query(`
        INSERT INTO users (name, email, password, age)
        VALUES ($1, $2, $3, $4) RETURNING *
    `, [name, email, password, age]
        )
        // console.log(result.rows[0]);

        res.status(201).json({
            success: true,
            message: "User created successfully",
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
                SET name = $1, 
                password = $2, 
                age = $3, 
                is_active = $4
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
   
// App listen 
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})