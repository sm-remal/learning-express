import type { NextFunction, Request, Response } from "express";
import fs from "fs";

const logger = (req: Request, res: Response, next: NextFunction) => {
    console.log("Method - URL - Time", req.method, req.url, Date.now());
    const log = `\n Method -> ${req.method}, Time -> ${Date.now()}, Time -> ${req.url} \n`

    fs.appendFile("logger.txt", log, (error) => {
        console.log(error);
    })

    next();
}

export default logger;