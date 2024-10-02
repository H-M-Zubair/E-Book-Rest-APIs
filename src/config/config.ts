import { config as dotenvConfig } from "dotenv";
dotenvConfig();
const _config = {
    port: process.env.PORT,
};

export const config = Object.freeze(_config);
