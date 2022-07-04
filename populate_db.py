#!/usr/bin/env python3

import hashlib
import sys
import sqlite3


"""
populate_db.py - inserts test data into main.db

usage:
    ./populate_db.py <start> <end>

    where:
        <start> => integer, inclusive
        <end>   => integer, exclusive
"""


def sha256(data):
    return hashlib.sha256(data.encode("utf-8")).hexdigest()


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(f"usage: {sys.argv[0]} <start> <end>", file=sys.stderr)
        sys.exit(1)
    a = None
    b = None
    try:
        a = int(sys.argv[1])
        b = int(sys.argv[2])
    except:
        print("<start> and <end> must be integers", file=sys.stderr)
        sys.exit(1)
    rs = []
    for i in range(a, b):
        rdn = f"user{i}"
        rdp = f"pass{i}"
        rdm = f"mail{i}@example.com"
        rs.append((rdn, sha256(rdp), rdm))
        print(f"[I] {rdn}:{rdp} ({rs[i-a][1][:5]}...), ({rdm})")
    with sqlite3.connect("main.db") as cn:
        c = cn.cursor()
        try:
            c.executemany(
                "INSERT INTO users VALUES (NULL, 0, ?, ?, ?, NULL, NULL)", rs)
            cn.commit()
        except Exception as e:
            print(f"insertion failed: {e}", file=sys.stderr)
