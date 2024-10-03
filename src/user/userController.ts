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
    //check if user already exists
    const user = await UserModel.findOne({ email });
    if (user) {
        const error = createHttpError(400, "user already exists");
        return next(error);
    }
    //Hashing Password
    const hashedPassword = await bcrypt.hash(password, 10);
    //Saving the New User
    const newUser = new UserModel({
        name,
        email,
        password: hashedPassword,
    });

    const token = sign({ sub: newUser._id }, process.env.JWT_SECRET!, {
        expiresIn: "7d",
    });
    await newUser.save();
    res.status(201).json({
        message: "User created successfully",
        id: newUser._id,
        token,
    });
};
