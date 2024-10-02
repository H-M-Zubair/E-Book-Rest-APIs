import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async () => {
    try {
        console.log("Connecting to MongoDB...");
        console.log("Config to DB URL...", config.databaseUrl);

        // Set up event listeners before initiating connection
        mongoose.connection.on("connected", () => {
            console.log("Successfully connected to the database");
        });

        mongoose.connection.on("error", (err) => {
            console.error("Failed to connect to database", err);
        });

        // Try to connect to the database
        await mongoose.connect(config.databaseUrl as string);
        console.log("mongoose.connect() was successful");
    } catch (err) {
        console.error(
            "An error occurred while trying to connect to the database",
            err
        );
        process.exit(1);
    }
};

export default connectDB;
