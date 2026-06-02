import express, { type Application, type Request, type Response } from "express"
const app: Application = express()
const port = 5000

app.get('/', (req: Request, res: Response) => {
//   res.send('Hello World!')
    res.status(200).json({
        message: "Explore express with TypeScript",
        author: "Next Level"
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})