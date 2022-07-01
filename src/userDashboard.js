import "dotenv/config";
import express from "express";
import { expressjwt as ejwt } from "express-jwt";

import { getUserByCredentialsAsync } from "./database.js";

const r = express.Router();


r.use(express.json());

r.use(ejwt({ 
    secret: process.env["JWT_SECRET"], 
    algorithms: ["HS256"],
    isRevoked: (req, token) => {
        let [name, hash] = [token.payload.name, token.payload.hash];
        getUserByCredentialsAsync(name, hash, false).then((user) => {
            req.user = user;
            return false;
        }).catch((_) => {
            return true;
        });
    }
}));

r.use((err, _, res, next) => {
    if (err.name === "UnauthorizedError") {
        res.status(err.status).send({
            success: false,
            error: "invalid token"
        });
        return;
    }
    next();
});

r.get("/info", (req, res) => {
    res.status(200).send({
        success: true,
        info: {
            username: req.user.name
        }
    });
});

r.post("/info", (req, res) => {
    res.status(400).send({
        success: false
    });
});

r.get("/note", (req, res) => {
    res.sendStatus(500);
});

r.post("/note", (req, res) => {
    res.status(400).send({
        success: false
    });
});

export default r;