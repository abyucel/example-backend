import Database from "better-sqlite3";
import path from "path";

import { sha256hash } from "./utils.js";

const namePtn = /[a-z0-9_]{3,16}/;
const hashPtn = /[a-fA-F0-9]{64}/;
const emailPtn = /[^\s@]+@[^\s@]+/;

const db = new Database(path.join(process.cwd(), "main.db"));


export function setupDatabase() {
    db.exec(
        `
        CREATE TABLE IF NOT EXISTS users (
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            lvl       INTEGER NOT NULL,
            name      TEXT NOT NULL UNIQUE,
            hash      TEXT NOT NULL,
            email     TEXT,
            firstName TEXT,
            lastName  TEXT
        );
        `
    );
}

export function getUserByCredentials(name, hash, rehash=true) {
    let user = db.prepare("SELECT * FROM users WHERE name = ? AND hash = ?;")
        .get(name, rehash ? sha256hash(hash) : hash);
    return user;
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
    return user;
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

export function addUser(name, hash, rehash=true) {
    if (!namePtn.test(name) || !hashPtn.test(hash)) {
        throw new Error("name or hash rejected");
    }
    db.prepare("INSERT INTO users VALUES (NULL, 0, ?, ?, NULL, NULL, NULL);")
        .run(name, rehash ? sha256hash(hash) : hash);
}

export function addUserAsync(name, hash, rehash=true) {
    return new Promise((resolve, reject) => {
        try {
            addUser(name, hash, rehash);
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

export function setUserDetailsByName(name, email, firstName, lastName) {
    if (email && emailPtn.test(email)) {
        db.prepare("UPDATE users SET email = ? WHERE name = ?;")
            .run(email, name);
    }
    if (firstName) {
        db.prepare("UPDATE users SET firstName = ? WHERE name = ?")
            .run(firstName, name);
    }
    if (lastName) {
        db.prepare("UPDATE users SET lastName = ? WHERE name = ?")
            .run(lastName, name);
    }
}

export function setUserDetailsByNameAsync(name, email, firstName, lastName) {
    return new Promise((resolve, reject) => {
        try {
            setUserDetailsByName(name, email, firstName, lastName);
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}