import express from "express";
import {
    deleteUserByNameAsync,
    getUserByNameAsync,
    getUsersAsync,
    setUserDetailsByNameAsync
} from "./database.js";

const r = express.Router();


r.use((req, res, next) => {
    if (req.user.lvl < 5) {
        res.status(400).send({
            success: false,
            error: "not an admin"
        });
        return;
    }
    next();
});

r.get("/", (req, res) => {
    if (!req.body.command) {
        res.status(200).send({
            success: false,
            error: "no command provided"
        });
        return;
    }
    switch (req.body.command) {
        case "getUsers":
            getUsersAsync().then((users) => {
                let ret = [];
                for (let i = 0; i < users.length; i++) {
                    let user = users[i];
                    let v = {
                        lvl: user.lvl,
                        name: user.name
                    };
                    if (user.email) v.email = user.email;
                    if (user.firstName) v.firstName = user.firstName;
                    if (user.lastName) v.lastName = user.lastName;
                    ret.push(v);
                }
                res.status(200).send({
                    success: true,
                    users: ret
                });
            }).catch((error) => {
                res.status(400).send({
                    success: false,
                    error: error
                });
            });
            break;
        case "getUser":
            if (!req.body.name) {
                res.status(400).send({
                    success: false,
                    error: "missing parameter"
                });
                return;
            }
            getUserByNameAsync(req.body.name).then((user) => {
                if (!user) {
                    res.status(400).send({
                        success: false,
                        error: "user doesn't exist"
                    });
                    return;
                }
                let v = {
                    lvl: user.lvl,
                    name: user.name
                };
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
            break;
        default:
            res.status(400).send({
                success: false,
                error: "unknown command"
            });
    }
});

r.post("/", (req, res) => {
    if (!req.body.command) {
        res.status(200).send({
            success: false,
            error: "no command provided"
        });
        return;
    }
    switch (req.body.command) {
        case "deleteUser":
            if (!req.body.name) {
                res.status(400).send({
                    success: false,
                    error: "missing parameter"
                });
                return;
            }
            if (req.body.name === req.user.name) {
                res.status(400).send({
                    success: false,
                    error: "cannot delete yourself"
                });
                return;
            }
            deleteUserByNameAsync(req.body.name).then(() => {
                res.status(200).send({
                    success: true
                });
            }).catch((error) => {
                res.status(400).send({
                    success: false,
                    error: error
                });
            });
            break;
        case "editUser":
            if (!req.body.name || !req.body.user) {
                res.status(400).send({
                    success: false,
                    error: "missing parameter"
                });
                return;
            }
            const u = req.body.user;
            setUserDetailsByNameAsync(req.body.name,
                u.email, u.firstName, u.lastName).then(() => {
                    res.status(200).send({
                        success: true
                    });
                }).catch((error) => {
                    res.status(400).send({
                        success: false,
                        error: error
                    });
                });
            break;
        default:
            res.status(400).send({
                success: false,
                error: "unknown command"
            });
    }
});

export default r;
