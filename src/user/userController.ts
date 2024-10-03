import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

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
    console.log(name, email, password);
    res.json({ message: "Create User" });
};
