import express from "express";
import cors from "cors";

import r from "./user.js";
import { setupDatabase } from "./database.js";

const port = 3001;
const app = express();


app.use(cors())

app.use("/api/user", r);

app.get("/api", (_, res) => {
    res.sendStatus(200);
});


setupDatabase();
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});