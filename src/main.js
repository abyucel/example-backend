import express from "express";
import r from "./user.js";

const port = 3000;
const app = express();

app.use("/api/user", r);

app.get("/api", (_, res) => {
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});