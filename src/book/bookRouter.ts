import express from "express";
import { createBookWithCloudinary } from "./bookController";
import { upload } from "../../lib/Multer";

const bookRouter = express.Router();

bookRouter.post(
    "/create-book",
    upload.fields([
        { name: "coverImage", maxCount: 1 },
        { name: "file", maxCount: 1 },
    ]),
    createBookWithCloudinary
);
export default bookRouter;
