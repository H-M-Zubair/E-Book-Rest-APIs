import { config as dotenvConfig } from "dotenv";
dotenvConfig();
const _config = {
    port: process.env.PORT,
    databaseUrl: process.env.MONGO_CONNECTION_STRING,
    env: process.env.NODE_ENV,
};

export const config = Object.freeze(_config);
