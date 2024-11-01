import createHttpError from "http-errors";
// import bookModel from "./bookModel";
// Import your User model
import { NextFunction, Request, Response } from "express";
// import UserModel from "../user/UserModel";
import path from "node:path";
import cloudinary from "../config/cloudinary";
// import cloudinary from "../config/cloudinary";

// export const createBookWithoutCloudinary = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     /**For THIS CONTROLLER YOU SHOULD PASS ID OF THE AUTHOR NOT THE NAME */

//     const { title, author, genre } = req.body;
//     const files = req.files as
//         | { [fieldname: string]: Express.Multer.File[] } // Defining Types of req.files
//         | undefined;

//     // Fetching Multer-created filename
//     const coverImage = files?.["coverImage"]?.[0]?.filename; // Get the filename of the cover image
//     const file = files?.["file"]?.[0]?.filename; // Get the filename of the book file

//     // Check for required fields
//     if (!title || !author || !genre || !coverImage || !file) {
//         return next(createHttpError(400, "All fields are required"));
//     }

//     console.log(title, author, coverImage, file);

//     try {
//         // Validate that the author ID exists in the database
//         const validAuthor = await UserModel.findById(author);
//         if (!validAuthor) {
//             return next(createHttpError(400, "Author does not exist"));
//         }

//         // Create the book entry
//         const book = await bookModel.create({
//             title,
//             author, // The valid ObjectId from the request
//             genre,
//             coverImage,
//             file,
//         });

//         // Return the created book
//         res.status(201).json(book);
//     } catch (err) {
//         console.error(err);
//         return next(createHttpError(500, "Error in creating book"));
//     }
// };

export const createBookWithCloudinary = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const files = req.files as
        | { [fieldname: string]: Express.Multer.File[] }
        | undefined;

    // Fetching Multer-created filenames for cover image and book file
    const coverImageFileName = files?.["coverImage"]?.[0]?.filename;
    const bookFileName = files?.["file"]?.[0]?.filename;

    // Ensure both files exist
    if (!coverImageFileName || !bookFileName) {
        return next(
            createHttpError(400, "Both cover image and book file are required.")
        );
    }

    // Paths for the cover image and book file
    const coverImagePath = path.resolve(
        __dirname,
        "../../public/data/uploads",
        coverImageFileName
    );
    const bookFilePath = path.resolve(
        __dirname,
        "../../public/data/uploads",
        bookFileName
    );

    // Determine MIME types
    const coverImageMimeType = files?.["coverImage"]?.[0]?.mimetype
        .split("/")
        .pop(); // Get file extension for cover image
    const bookMimeType = files?.["file"]?.[0]?.mimetype; // Ensure it’s a PDF

    // Ensure the book is a PDF
    if (bookMimeType !== "application/pdf") {
        return next(createHttpError(400, "Book file must be a PDF."));
    }

    try {
        // Upload the cover image to Cloudinary
        const coverUploadResult = await cloudinary.uploader.upload(
            coverImagePath,
            {
                public_id: coverImageFileName,
                folder: "book-covers",
                format: coverImageMimeType, // optional: convert to the file's original format (jpg, png, etc.)
            }
        );

        // Upload the book file (PDF) to Cloudinary
        const bookUploadResult = await cloudinary.uploader.upload(
            bookFilePath,
            {
                public_id: bookFileName,
                folder: "book-pdfs",
                resource_type: "raw",
                format: "pdf", // Needed for non-image files like PDFs
            }
        );

        // Handle successful uploads (e.g., save details to the database)
        res.status(201).json({
            message: "Book and cover image uploaded successfully!",
            coverImage: coverUploadResult.secure_url,
            bookFile: bookUploadResult.secure_url,
        });
    } catch (error) {
        console.error(error);
        return next(
            createHttpError(500, "Error uploading files to Cloudinary.")
        );
    }
};
