import multer from "multer";
import path from "node:path";

export const upload = multer({
    dest: path.resolve(__dirname, "../public/data/uploads"),

    limits: {
        fileSize: 30 * 1024 * 1024, //30mb
    },
});
