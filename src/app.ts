import express, { Request, Response } from "express";

import globalErrorHandler from "./middleware/GlobalErrorHandler";
import userRouter from "./user/userRouter";
const app = express();
app.use(express.json());
// Routes

// Http Methods: GET, POST, PUT, PATCH, DELETE

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hello World" });
});

app.use("/api/users", userRouter);

//Glogbal Error Handler:
app.use(globalErrorHandler);
export default app;
