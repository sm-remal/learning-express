import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import type { ROLE } from "../types";

const auth = (...roles: ROLE[]) => {

    return async (req: Request, res: Response, next: NextFunction) => {
        console.log(roles);
        try {
            // console.log("This is protected route!!");
            // console.log(req.headers.authorization);


            // 1. Check, if the token exist
            // 2. Verify the token
            // 3. Find the user into database
            // 4. If the user active or not


            // 1. Check, if the token exist
            const token = req.headers.authorization;

            if (!token) {
                res.status(401).json({
                    success: false,
                    message: "Unauthorized access",
                })
            }

            // 2. Verify the token
            const decoded = jwt.verify(token as string, config.secret as string) as JwtPayload;
            // console.log(decoded);


            // 3. Find the user into database
            const userData = await pool.query(`
            SELECT * FROM users WHERE email = $1
            `, [decoded.email])

            // console.log(userData.rows[0]);
            const user = userData.rows[0];

            if (userData.rows.length === 0) {
                res.status(404).json({
                    success: false,
                    message: "User not found!!",
                })
            }

            // 4. If the user active or not
            if (!user?.is_active) {
                res.status(403).json({
                    success: false,
                    message: "Forbidden !!",
                })
            }

            // console.log(user.role);

            // 5. Role wise validation 
            if (roles.length && !roles.includes(user.role)) {
                res.status(403).json({
                    success: false,
                    message: "Forbidden !! This role have no access",
                })
            }


            req.user = decoded      // req: { user: {} }

            next();

        } catch (error) {
            next(error);
        }
    }
}

export default auth;