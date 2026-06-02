import express, { type Application, type Request, type Response } from "express"
const app: Application = express()
const port = 5000

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