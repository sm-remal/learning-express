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
app.post('/', async (req: Request, res: Response) => {
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
            message: "User created successfully",
            data: result.rows[0],
        })
    } catch (error: any) {
        res.status(500).json({
            message: error.message, 
            error: error,
        })
    }
})

// App listen 
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})