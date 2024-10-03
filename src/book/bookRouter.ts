import express from "express";
import { createBook } from "./bookController";

const userRouter = express.Router();

userRouter.post("/create-book", createBook);
export default userRouter;
