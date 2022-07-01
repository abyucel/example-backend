import Database from "better-sqlite3";
import path from "path";

import { sha256hash } from "./utils.js"

const namePtn = /[a-z0-9_]{3,16}/
const hashPtn = /[a-fA-F0-9]{64}/;

const db = new Database(path.join(process.cwd(), "main.db"));

db.exec(
    `
    CREATE TABLE IF NOT EXISTS user (
        id   INTEGER PRIMARY KEY AUTOINCREMENT,
        lvl  INTEGER NOT NULL,
        name VARCHAR(16) NOT NULL UNIQUE,
        hash VARCHAR(64) NOT NULL
    );
    CREATE TABLE IF NOT EXISTS todo (
        id                   INTEGER PRIMARY KEY AUTOINCREMENT,
        name                 TEXT NOT NULL,
        desc                 BLOB NOT NULL,
        content              BLOB NOT NULL,
        icon                 INTEGER NOT NULL,
        user_id              INTEGER NOT NULL,
        store_id             INTEGER NOT NULL,
        FOREIGN KEY(user_id) REFERENCES user(id)
    );
    `
);

export function getUserByCredentials(name, hash, rehash=true) {
    let user = db.prepare("SELECT * FROM users WHERE name = ? AND hash = ?;")
        .get(name, rehash ? sha256hash(hash) : hash);
    return user === undefined ? null : user;
}

export function getUserByCredentialsAsync(name, hash, rehash=true) {
    return new Promise((resolve, reject) => {
        try {
            let user = getUserByCredentials(name, hash, rehash);
            resolve(user);
        } catch (error) {
            reject(error);
        }
    });
}

export function getUserByName(name) {
    let user = db.prepare("SELECT * FROM users WHERE name = ?;").get(name);
    return user === undefined ? null : user;
}

export function getUserByNameAsync(name) {
    return new Promise((resolve, reject) => {
        try {
            let user = getUserByName(name);
            resolve(user);
        } catch (error) {
            reject(error);
        }
    });
}

export function addUser(name, hash) {
    if (!namePtn.test(name) || !hashPtn.test(hash)) {
        throw new Error("name or hash rejected");
    }
    const newHash = sha256hash(hash);
    db.prepare("INSERT INTO users VALUES (NULL, 0, ?, ?);")
        .run(name, newHash);
}

export function addUserAsync(name, hash) {
    return new Promise((resolve, reject) => {
        try {
            addUser(name, hash);
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}