import "dotenv/config";
import express from "express";
import { expressjwt as ejwt } from "express-jwt";

import admin from "./admin.js";
import {
    getUserByCredentialsAsync,
    setUserDetailsByNameAsync
} from "./database.js";

const r = express.Router();

r.use(express.json());

r.use(ejwt({
    secret: process.env["JWT_SECRET"],
    algorithms: ["HS256"],
    isRevoked: (req, token) => {
        const [name, hash] = [token.payload.name, token.payload.hash];
        getUserByCredentialsAsync(name, hash, false).then((user) => {
            req.user = {
                name: user.name,
                hash: user.hash,
                lvl: user.lvl
            };
            return false;
        }).catch(() => {
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

r.use("/admin", admin);

r.get("/info", (req, res) => {
    const [name, hash] = [req.user.name, req.user.hash];
    getUserByCredentialsAsync(name, hash, false).then((user) => {
        let v = {};
        if (user.email) v.email = user.email;
        if (user.firstName) v.firstName = user.firstName;
        if (user.lastName) v.lastName = user.lastName;
        res.status(200).send({
            success: true,
            user: v
        });
    }).catch((error) => {
        res.status(400).send({
            success: false,
            error: error
        });
    });
});

r.post("/info", (req, res) => {
    setUserDetailsByNameAsync(req.user.name,
        req.body.email, req.body.firstName, req.body.lastName)
        .then(() => {
            res.status(200).send({
                success: true
            });
        }).catch((error) => {
            res.status(400).send({
                success: false,
                error: error
            });
        });
});

export default r;
