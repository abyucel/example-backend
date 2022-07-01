import crypto from "crypto";

export const sha256hash = (data) => 
    crypto.createHash("sha256").update(data).digest("hex");

export const readableObject = (obj) => JSON.stringify(obj, null, 2);