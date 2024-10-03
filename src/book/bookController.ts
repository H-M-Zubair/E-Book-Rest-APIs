import createHttpError from "http-errors";
import bookModel from "./bookModel";
import { NextFunction, Request, Response } from "express";

export const createBook = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { title, author, genre, coverImage, file } = req.body;
    if (!title || !author || !genre || !coverImage || !file) {
        const error = createHttpError(400, "All fields are required");
        return next(error);
    }
    try {
        const book = await bookModel.create({
            title,
            author,
            genre,
            coverImage,
            file,
        });
        res.status(201).json(book);
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, "Error in creating book"));
    }
};
