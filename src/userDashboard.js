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
            username: req.user.username
        }
    });
});

r.post("/info", (req, res) => {
    res.status(400).send({
        success: false
    });
});

r.get("/todo", (req, res) => {
    res.sendStatus(500);
});

r.post("/todo", (req, res) => {
    console.log(req.body);
    res.status(400).send({
        success: false
    });
});

/*
 * permission levels
 * - 0 => regular user
 * - 5 => admin
 * admin endpoints
 * - /admin => control everything via json messages
 *          .. requires permission level 5, return "missing perms" otherwise
 *          .. POST for all commands
 */

export default r;