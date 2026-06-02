import express, { type Application, type Request, type Response } from "express"
import {Pool} from "pg"
const app: Application = express() 
const port = 5000

// Middleware
app.use(express.json());

// Connection to PostgreSQL
const pool = new Pool({
    connectionString: "postgresql://neondb_owner:npg_qBbu6zIUWTS4@ep-young-dust-aq76qs2o.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require"
})

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
    const {name, email, password} = req.body;
    res.status(201).json({
        message: "Data received successfully",
        data: {
            name,
            email,
        }
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})