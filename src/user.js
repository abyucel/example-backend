import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";

import { addUserAsync, getUserByCredentialsAsync } from "./database.js";
import userDashboard from "./userDashboard.js";

const r = express.Router();

r.use(express.json());

r.use("/dashboard", userDashboard);

r.post("/register", (req, res) => {
    let [name, hash] = [req.body["name"], req.body["hash"]];
    addUserAsync(name, hash).then(() => {
        res.status(200).send({
            success: true
        });
    }).catch((error) => {
        res.status(400).send({
            success: false,
            error: error.message
        });
    });
});

r.post("/login", (req, res) => {
    let [name, hash] = [req.body["name"], req.body["hash"]];
    getUserByCredentialsAsync(name, hash).then((user) => {
        if (!user) {
            res.status(400).send({
                success: false,
                error: "user doesn't exist"
            });
            return;
        }
        const sessionToken = jwt.sign({
            id: user.id,
            name: user.name,
            hash: user.hash
        }, process.env["JWT_SECRET"], {
            algorithm: "HS256",
            expiresIn: "2h"
        });
        res.send({
            success: true,
            token: sessionToken
        });
    }).catch((error) => {
        res.status(400).send({
            success: false,
            error: error.message
        });
    });
});

export default r;