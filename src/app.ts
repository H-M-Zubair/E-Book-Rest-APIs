import express from "express";
import { Request, Response, NextFunction } from "express";
const app = express();

// Routes

// Http Methods: GET, POST, PUT, PATCH, DELETE

app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: "Hello World" });
});
export default app;
