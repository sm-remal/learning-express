import { pool } from "../../db";
import bcrypt from "bcryptjs";
import type { IUser } from "./user.interface";


// Create user into database
const createUserIntoDB = async (payload: IUser) => {

    const { name, email, password, age, role } = payload;
    const hashPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(`
        INSERT INTO users (name, email, password, age, role) 
        VALUES ($1, $2, $3, $4, COALESCE($5, 'user')) RETURNING *
    `, [name, email, hashPassword, age, role]
    )
    // console.log(result.rows[0]);

    delete result.rows[0].password;

    return result;
}


// Get all users from database
const getAllUsersFromDB = async () => {
    const result = await pool.query(`
            SELECT * FROM users
            `)
    return result;
}


// Get single user by id from database
const getSingleUserFromDB = async (id: string) => {
    const result = await pool.query(`
            SELECT * FROM users WHERE id = $1 
            `, [id]);
    return result;
}


// Update user by id from database
const updateUserIntoDB = async (payload: IUser, id: string) => {

    const { name, password, age, is_active } = payload;

    const result = await pool.query(`
            UPDATE users  
                SET name = COALESCE($1, name), 
                password = COALESCE($2, password), 
                age = COALESCE($3, age), 
                is_active = COALESCE($4, is_active)
            WHERE id = $5  
            RETURNING *
            `, [name, password, age, is_active, id]);

    return result;
}

// Delete user by id from database
const deleteUserFromDB = async (id: string) => {
    const result = await pool.query(`
            DELETE FROM users WHERE id = $1 RETURNING *
            `, [id]);

    return result;
}
export const userService = {
    createUserIntoDB,
    getAllUsersFromDB,
    getSingleUserFromDB,
    updateUserIntoDB,
    deleteUserFromDB,
}