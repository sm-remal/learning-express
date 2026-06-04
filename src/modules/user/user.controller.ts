import type { Request, Response } from "express";
import { userService } from "./user.service";

// Create user
const createUser = async (req: Request, res: Response) => {
    // console.log(req.body)
    // const { name, email, password, age } = req.body;

    try {

        const result = await userService.createUserIntoDB(req.body);

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
}


// Get all users
const getAllUsers = async (req: Request, res: Response) => {
    try {

        const result = await userService.getAllUsersFromDB();

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
}


// Get Single user by id
const getSingleUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {

        const result = await userService.getSingleUserFromDB(id as string);

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
}


// Update user by id
const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    // const { name, password, age, is_active } = req.body;

    // console.log({id, name, password, age, is_active}); 

    try {

        const result = await userService.updateUserIntoDB(req.body, id as string);

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
}

const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {

        const result = await userService.deleteUserFromDB(id as string);

        if (result.rowCount === 0) {
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
}

export const userController = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser,
}