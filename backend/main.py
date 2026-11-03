from __future__ import annotations

import os
import re
import sqlite3
import smtplib
import unicodedata
from datetime import datetime
from email.message import EmailMessage
from email.utils import formataddr
from pathlib import Path
from zoneinfo import ZoneInfo

from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, Field, field_validator

APP_TZ = ZoneInfo("Europe/Ljubljana")
DB_PATH = Path(os.getenv("LEADERBOARD_DB", "/opt/inforavi/data/leaderboard.db"))
NICKNAME_RE = re.compile(r"^[A-Za-z0-9ČŠŽčšž _-]{1,12}$")
EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]{2,}$")

SMTP_HOST = os.getenv("RAVI_SMTP_HOST", "").strip()
SMTP_PORT = int(os.getenv("RAVI_SMTP_PORT", "587"))
SMTP_USER = os.getenv("RAVI_SMTP_USER", "").strip()
SMTP_PASSWORD = os.getenv("RAVI_SMTP_PASSWORD", "")
SMTP_FROM = os.getenv("RAVI_SMTP_FROM", SMTP_USER).strip()
SMTP_FROM_NAME = os.getenv("RAVI_SMTP_FROM_NAME", "Srednja šola Ravne").strip()
SMTP_USE_TLS = os.getenv("RAVI_SMTP_USE_TLS", "1").strip() != "0"

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




class CertificateIn(ScoreIn):
    email: str = Field(min_length=3, max_length=120)

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        value = value.strip()
        if not EMAIL_RE.fullmatch(value):
            raise ValueError("E-poštni naslov ni veljaven.")
        return value


def pdf_ascii(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value)
    return "".join(ch for ch in normalized if ord(ch) < 128)


def pdf_escape(value: str) -> str:
    return pdf_ascii(value).replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def format_ms(ms: int) -> str:
    total_tenths = max(0, int(round(ms / 100)))
    minutes, tenths = divmod(total_tenths, 600)
    seconds, tenth = divmod(tenths, 10)
    return f"{minutes:02d}:{seconds:02d}.{tenth}"


def build_certificate_pdf(nickname: str, total_ms: int, played_date: str) -> bytes:
    # Minimal dependency-free one-page PDF; text is transliterated to ASCII for built-in Helvetica.
    lines = [
        ("RAVI INFO MISIJA", 28, 185, 700),
        ("DIPLOMA O USpesNO OPRAVLJENI MISIJI", 16, 130, 650),
        (pdf_ascii(nickname), 30, 210, 555),
        ("je uspesno obnovil RAVI-ja in opravil vseh 8 racunalniskih izzivov.", 13, 75, 505),
        (f"CAS MISIJE: {format_ms(total_ms)}", 18, 180, 425),
        ("MODULI: 8 / 8", 14, 220, 380),
        ("RAVI STATUS: 100 % ONLINE", 14, 180, 345),
        (f"INFORMATIVNI DAN | {played_date}", 11, 205, 245),
        ("SREDNJA SOLA RAVNE", 15, 205, 205),
    ]

    stream_parts = ["0.10 0.18 0.28 rg 0 0 595 842 re f", "1 1 1 rg"]
    for text_value, size, x, y in lines:
        stream_parts.append(f"BT /F1 {size} Tf {x} {y} Td ({pdf_escape(text_value)}) Tj ET")
    stream = "\n".join(stream_parts).encode("ascii")

    objects = []
    objects.append(b"<< /Type /Catalog /Pages 2 0 R >>")
    objects.append(b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>")
    objects.append(b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>")
    objects.append(f"<< /Length {len(stream)} >>\nstream\n".encode("ascii") + stream + b"\nendstream")
    objects.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>")

    pdf = bytearray(b"%PDF-1.4\n")
    offsets = [0]
    for i, obj in enumerate(objects, start=1):
        offsets.append(len(pdf))
        pdf.extend(f"{i} 0 obj\n".encode("ascii"))
        pdf.extend(obj)
        pdf.extend(b"\nendobj\n")

    xref = len(pdf)
    pdf.extend(f"xref\n0 {len(objects)+1}\n".encode("ascii"))
    pdf.extend(b"0000000000 65535 f \n")
    for offset in offsets[1:]:
        pdf.extend(f"{offset:010d} 00000 n \n".encode("ascii"))
    pdf.extend(
        f"trailer\n<< /Size {len(objects)+1} /Root 1 0 R >>\nstartxref\n{xref}\n%%EOF".encode("ascii")
    )
    return bytes(pdf)


def send_certificate_email(email: str, nickname: str, total_ms: int, played_date: str) -> None:
    if not SMTP_HOST or not SMTP_FROM:
        raise RuntimeError("Pošiljanje diplom na strežniku še ni nastavljeno.")

    pdf = build_certificate_pdf(nickname, total_ms, played_date)
    msg = EmailMessage()
    msg["Subject"] = "Tvoja diploma – RAVI INFO MISIJA"
    msg["From"] = formataddr((SMTP_FROM_NAME, SMTP_FROM))
    msg["To"] = email
    msg.set_content(
        f"""Pozdravljen/a {nickname},

uspešno si obnovil/a RAVI-ja in opravil/a vseh 8 računalniških izzivov.

Tvoj čas: {format_ms(total_ms)}

V priponki je diploma za uspešno opravljeno RAVI INFO MISIJO.

Srednja šola Ravne
Informativni dan
"""
    )
    msg.add_attachment(
        pdf,
        maintype="application",
        subtype="pdf",
        filename="RAVI-INFO-MISIJA-diploma.pdf",
    )

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=12) as smtp:
        smtp.ehlo()
        if SMTP_USE_TLS:
            smtp.starttls()
            smtp.ehlo()
        if SMTP_USER:
            smtp.login(SMTP_USER, SMTP_PASSWORD)
        smtp.send_message(msg)


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


@app.post("/leaderboard/certificate")
def post_certificate(certificate: CertificateIn) -> dict:
    calculated = sum(certificate.room_times_ms)
    if abs(calculated - certificate.total_ms) > 25:
        raise HTTPException(status_code=400, detail="Skupni čas se ne ujema s časi sob.")
    if certificate.total_ms < 8_000 or certificate.total_ms > 2 * 60 * 60 * 1000:
        raise HTTPException(status_code=400, detail="Čas misije ni veljaven.")

    played_date = datetime.now(APP_TZ).date().isoformat()

    try:
        send_certificate_email(
            certificate.email,
            certificate.nickname,
            certificate.total_ms,
            played_date,
        )
    except Exception as exc:
        print(f"Certificate email failed: {exc}")
        raise HTTPException(status_code=503, detail="Diplome trenutno ni bilo mogoče poslati.")

    return {"ok": True, "sent": True}
