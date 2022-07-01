import crypto from "crypto";

export function sha256hash(data) {
    return crypto.createHash("sha256").update(data).digest("hex");
}

export function readableObject(obj) {
    return JSON.stringify(obj, null, 2);
}