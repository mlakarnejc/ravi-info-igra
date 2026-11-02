from __future__ import annotations

import os
import re
import sqlite3
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, Field, field_validator

APP_TZ = ZoneInfo("Europe/Ljubljana")
DB_PATH = Path(os.getenv("LEADERBOARD_DB", "/opt/inforavi/data/leaderboard.db"))
NICKNAME_RE = re.compile(r"^[A-Za-z0-9ČŠŽčšž _-]{1,12}$")

app = FastAPI(title="RAVI INFO MISIJA Leaderboard", docs_url=None, redoc_url=None)


class ScoreIn(BaseModel):
    nickname: str = Field(min_length=1, max_length=12)
    room_times_ms: list[int] = Field(min_length=8, max_length=8)
    total_ms: int

    @field_validator("nickname")
    @classmethod
    def validate_nickname(cls, value: str) -> str:
        value = value.strip().upper()
        if not NICKNAME_RE.fullmatch(value):
            raise ValueError("Vzdevek lahko vsebuje črke, številke, presledek, _ in -.")
        return value

    @field_validator("room_times_ms")
    @classmethod
    def validate_room_times(cls, value: list[int]) -> list[int]:
        if any(v < 100 for v in value):
            raise ValueError("Vsaka soba mora imeti veljaven čas.")
        if any(v > 30 * 60 * 1000 for v in value):
            raise ValueError("Čas posamezne sobe je predolg.")
        return value


def connect() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    with connect() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS scores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nickname TEXT NOT NULL,
                total_ms INTEGER NOT NULL,
                room1_ms INTEGER NOT NULL,
                room2_ms INTEGER NOT NULL,
                room3_ms INTEGER NOT NULL,
                room4_ms INTEGER NOT NULL,
                room5_ms INTEGER NOT NULL,
                room6_ms INTEGER NOT NULL,
                room7_ms INTEGER NOT NULL,
                room8_ms INTEGER NOT NULL,
                played_date TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )
        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_scores_date_total ON scores (played_date, total_ms)"
        )


@app.on_event("startup")
def startup() -> None:
    init_db()


def today_key() -> str:
    return datetime.now(APP_TZ).date().isoformat()


def best_scores(conn: sqlite3.Connection, limit: int = 10, scope: str = "today") -> list[dict]:
    if scope == "all":
        rows = conn.execute(
            """
            SELECT s.nickname, s.total_ms
            FROM scores s
            JOIN (
                SELECT nickname, MIN(total_ms) AS best_ms
                FROM scores
                GROUP BY nickname
            ) b
              ON b.nickname = s.nickname AND b.best_ms = s.total_ms
            GROUP BY s.nickname
            ORDER BY s.total_ms ASC, MIN(s.id) ASC
            LIMIT ?
            """,
            (limit,),
        ).fetchall()
    else:
        rows = conn.execute(
            """
            SELECT s.nickname, s.total_ms
            FROM scores s
            JOIN (
                SELECT nickname, MIN(total_ms) AS best_ms
                FROM scores
                WHERE played_date = ?
                GROUP BY nickname
            ) b
              ON b.nickname = s.nickname AND b.best_ms = s.total_ms
            WHERE s.played_date = ?
            GROUP BY s.nickname
            ORDER BY s.total_ms ASC, MIN(s.id) ASC
            LIMIT ?
            """,
            (today_key(), today_key(), limit),
        ).fetchall()

    return [{"nickname": row["nickname"], "total_ms": row["total_ms"]} for row in rows]


@app.get("/health")
def health() -> dict:
    return {"ok": True}


@app.get("/leaderboard")
def get_leaderboard(
    limit: int = Query(default=10, ge=1, le=50),
    scope: str = Query(default="today", pattern="^(today|all)$"),
) -> dict:
    with connect() as conn:
        return {"date": today_key(), "scope": scope, "top": best_scores(conn, limit, scope)}


@app.post("/leaderboard")
def post_leaderboard(score: ScoreIn) -> dict:
    calculated = sum(score.room_times_ms)
    if abs(calculated - score.total_ms) > 25:
        raise HTTPException(status_code=400, detail="Skupni čas se ne ujema s časi sob.")

    if score.total_ms < 8_000:
        raise HTTPException(status_code=400, detail="Skupni čas je prenizek.")
    if score.total_ms > 2 * 60 * 60 * 1000:
        raise HTTPException(status_code=400, detail="Skupni čas je predolg.")

    now = datetime.now(APP_TZ)
    played_date = now.date().isoformat()

    with connect() as conn:
        conn.execute(
            """
            INSERT INTO scores (
                nickname, total_ms,
                room1_ms, room2_ms, room3_ms, room4_ms,
                room5_ms, room6_ms, room7_ms, room8_ms,
                played_date, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                score.nickname,
                score.total_ms,
                *score.room_times_ms,
                played_date,
                now.isoformat(timespec="seconds"),
            ),
        )
        conn.commit()

        all_best = best_scores(conn, 1000, "today")
        rank = next(
            (index + 1 for index, row in enumerate(all_best) if row["nickname"] == score.nickname),
            None,
        )
        top = best_scores(conn, 10, "today")

    for row in top:
        row["is_current"] = row["nickname"] == score.nickname

    return {
        "ok": True,
        "date": played_date,
        "rank": rank,
        "top": top,
    }
