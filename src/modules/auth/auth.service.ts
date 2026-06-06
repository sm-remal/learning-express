import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { AuthUser } from "./auth.interface"
import jwt from 'jsonwebtoken'
import config from "../../config";

const loginUserIntoDB = async (payload: AuthUser) => {

    const { email, password } = payload;

    // 1. Check, if the user is exist
    // 2. Compare the password
    // 3. Generate token

    const userData = await pool.query(`
        SELECT * FROM users WHERE email = $1
        `, [email]);

    // 1. Check, if the user is exist
    if (userData.rows[0] === 0) {
        throw new Error("Invalided Credential");
    }

    const user = userData.rows[0];

    // 2. Compare the password
    const matchPassword = await bcrypt.compare(password, user.password);
    console.log(matchPassword);
    if(!matchPassword) {
        throw new Error("Invalided Credential");
    }

    // 3. Generate Token ( payload, secret, expire-date )
    const jwtPayload = {
        id: user.id,
        email: user.email,
        name: user.name,
        is_active: user.is_active,
    }
    const accessToken = jwt.sign(jwtPayload, config.secret as string, {expiresIn: "1d"});

    return {accessToken};
}

export const authService = {
    loginUserIntoDB,
}