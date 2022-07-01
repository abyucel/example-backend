import express from "express";

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
    // TODO
    switch (req.body.command) {
    case "getUsers":
        break;
    case "getUser":
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
    // TODO
    switch (req.body.command) {
    case "deleteUser":
        break;
    case "editUser":
        break;
    default:
        res.status(400).send({
            success: false,
            error: "unknown command"
        });
    }
});

export default r;