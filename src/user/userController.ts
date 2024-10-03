import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import UserModel from "./UserModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
export const createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log(req.body);
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        const error = createHttpError(400, "All fields are required");
        return next(error);
    }
    try {
        const user = await UserModel.findOne({ email });
        if (user) {
            const error = createHttpError(400, "user already exists");
            return next(error);
        }
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, "Error in fetching User"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = await UserModel.create({
            name,
            email,
            password: hashedPassword,
        });
        const token = sign({ sub: newUser._id }, process.env.JWT_SECRET!, {
            expiresIn: "7d",
        });

        res.status(201).json({
            message: "User created successfully",
            id: newUser._id,
            token,
        });
    } catch (error) {
        console.log(error);
        return next(createHttpError(500, "Error in creating user"));
    }
};
