import express, { NextFunction, Request, Response } from "express";

import globalErrorHandler from "./middleware/GlobalErrorHandler";
const app = express();

// Routes

// Http Methods: GET, POST, PUT, PATCH, DELETE

app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: "Hello World" });
});

//Glogbal Error Handler:
app.use(globalErrorHandler);
export default app;
