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

export const loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(createHttpError(400, "All fields are required"));
    }
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return next(createHttpError(400, "Invalid credentials"));
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return next(createHttpError(400, "Invalid credentials"));
        }
        const token = sign({ sub: user._id }, process.env.JWT_SECRET!, {
            expiresIn: "7d",
        });
        res.json({ message: "user login", token });
    } catch (error) {
        console.log(error);
        return next(createHttpError(500, "Error in logging in user"));
    }
};
