import express from "express";
import { createBook } from "./bookController";
import { upload } from "../../lib/Multer";

const userRouter = express.Router();

userRouter.post(
    "/create-book",
    upload.fields([
        { name: "coverImage", maxCount: 1 },
        { name: "file", maxCount: 1 },
    ]),
    createBook
);
export default userRouter;
