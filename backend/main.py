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
    """Create the RAVI INFO MISIJA certificate as a landscape A4 PDF."""
    try:
        from io import BytesIO
        from reportlab.lib.colors import Color, HexColor
        from reportlab.lib.pagesizes import A4, landscape
        from reportlab.lib.units import mm
        from reportlab.lib.utils import ImageReader
        from reportlab.pdfbase import pdfmetrics
        from reportlab.pdfbase.ttfonts import TTFont
        from reportlab.pdfgen import canvas
    except ImportError as exc:
        raise RuntimeError("Za izdelavo diplome manjka paket reportlab.") from exc

    regular_candidates = [
        "/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    bold_candidates = [
        "/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    ]

    regular_font = next((p for p in regular_candidates if Path(p).exists()), None)
    bold_font = next((p for p in bold_candidates if Path(p).exists()), None)

    if regular_font and bold_font:
        if "RaviSans" not in pdfmetrics.getRegisteredFontNames():
            pdfmetrics.registerFont(TTFont("RaviSans", regular_font))
        if "RaviSans-Bold" not in pdfmetrics.getRegisteredFontNames():
            pdfmetrics.registerFont(TTFont("RaviSans-Bold", bold_font))
        font_regular = "RaviSans"
        font_bold = "RaviSans-Bold"
    else:
        font_regular = "Helvetica"
        font_bold = "Helvetica-Bold"

    try:
        date_label = datetime.fromisoformat(played_date).strftime("%d. %m. %Y")
    except ValueError:
        date_label = played_date

    buffer = BytesIO()
    width, height = landscape(A4)
    pdf = canvas.Canvas(buffer, pagesize=(width, height))

    navy = HexColor("#07111D")
    panel = HexColor("#0D1B2A")
    red = HexColor("#E53945")
    white = HexColor("#F5F7FA")
    muted = HexColor("#9EB0C3")
    cyan = HexColor("#56D7E8")
    green = HexColor("#7FE0B7")
    line = HexColor("#334A60")
    dark_screen = HexColor("#091823")
    robot_body = HexColor("#1C3144")

    project_root = Path(__file__).resolve().parent.parent
    school_logo_path = project_root / "assets" / "images" / "logo.png"
    ravi_image_path = project_root / "assets" / "ravi" / "ravi-9.webp"

    pdf.setFillColor(navy)
    pdf.rect(0, 0, width, height, fill=1, stroke=0)

    # Subtle technical grid.
    pdf.setStrokeColor(Color(0.22, 0.38, 0.52, alpha=0.16))
    pdf.setLineWidth(0.35)
    for x in range(0, int(width), 24):
        pdf.line(x, 0, x, height)
    for y in range(0, int(height), 24):
        pdf.line(0, y, width, y)

    margin = 15 * mm
    pdf.setStrokeColor(line)
    pdf.setLineWidth(1.2)
    pdf.roundRect(margin, margin, width - 2 * margin, height - 2 * margin, 8, stroke=1, fill=0)

    pdf.setStrokeColor(red)
    pdf.setLineWidth(3)
    pdf.line(margin, height - margin, margin + 72 * mm, height - margin)

    x0 = margin + 5 * mm

    # Header + official school logo.
    if school_logo_path.exists():
        try:
            logo = ImageReader(str(school_logo_path))
            logo_w, logo_h = logo.getSize()
            target_h = 22 * mm
            target_w = target_h * (logo_w / logo_h)
            target_w = min(target_w, 62 * mm)
            logo_x = width - margin - target_w - 10 * mm
            logo_y = height - margin - 18 * mm
            pdf.drawImage(
                logo,
                logo_x,
                logo_y,
                width=target_w,
                height=target_h,
                preserveAspectRatio=True,
                mask="auto",
            )
        except Exception as exc:
            print(f"Certificate logo render failed: {exc}")

    pdf.setFont(font_bold, 11)
    pdf.setFillColor(red)
    pdf.drawString(x0, height - margin - 12 * mm, "SREDNJA ŠOLA RAVNE  //  INFORMATIVNI DAN")

    pdf.setFont(font_bold, 30)
    pdf.setFillColor(white)
    pdf.drawString(x0, height - margin - 29 * mm, "RAVI INFO MISIJA")

    pdf.setFont(font_regular, 12)
    pdf.setFillColor(muted)
    pdf.drawString(x0, height - margin - 40 * mm, "DIPLOMA O USPEŠNO OPRAVLJENI MISIJI")

    # Recipient.
    y = height - margin - 64 * mm
    pdf.setFont(font_regular, 11)
    pdf.setFillColor(muted)
    pdf.drawString(x0, y, "MISIJO JE USPEŠNO OPRAVIL/A")

    display_name = nickname[:18]
    name_size = 34 if len(display_name) <= 10 else 28 if len(display_name) <= 14 else 23
    pdf.setFont(font_bold, name_size)
    pdf.setFillColor(white)
    pdf.drawString(x0, y - 16 * mm, display_name)

    pdf.setStrokeColor(red)
    pdf.setLineWidth(1.2)
    pdf.line(x0, y - 20 * mm, x0 + 110 * mm, y - 20 * mm)

    pdf.setFont(font_regular, 11.5)
    pdf.setFillColor(white)
    pdf.drawString(x0, y - 31 * mm, "Uspešno si obnovil/a RAVI-ja in opravil/a vseh 8")
    pdf.drawString(x0, y - 38 * mm, "računalniških izzivov.")

    # Mission result cards.
    box_y = 44 * mm
    box_w = 48 * mm
    gap = 5 * mm
    metrics = [
        ("ČAS MISIJE", format_ms(total_ms), red),
        ("MODULI", "8 / 8", cyan),
        ("RAVI STATUS", "100 % ONLINE", green),
    ]

    for index, (label, value, accent) in enumerate(metrics):
        bx = x0 + index * (box_w + gap)
        pdf.setFillColor(panel)
        pdf.roundRect(bx, box_y, box_w, 25 * mm, 6, fill=1, stroke=0)
        pdf.setStrokeColor(accent)
        pdf.setLineWidth(1.2)
        pdf.roundRect(bx, box_y, box_w, 25 * mm, 6, fill=0, stroke=1)

        pdf.setFont(font_bold, 8)
        pdf.setFillColor(muted)
        pdf.drawString(bx + 4 * mm, box_y + 16 * mm, label)

        value_size = 15 if len(value) <= 11 else 12.5
        pdf.setFont(font_bold, value_size)
        pdf.setFillColor(accent)
        pdf.drawString(bx + 4 * mm, box_y + 7 * mm, value)

    # Activated modules.
    pdf.setFont(font_bold, 8)
    pdf.setFillColor(muted)
    pdf.drawString(x0, 31 * mm, "AKTIVIRANI MODULI")

    modules = ["OPREMA", "PYTHON", "SPLET", "PODATKI", "OMREŽJA", "VARNOST", "APLIKACIJE", "AI"]
    chip_w = 18 * mm
    for index, module in enumerate(modules):
        bx = x0 + index * (chip_w + 1.6 * mm)
        pdf.setFillColor(HexColor("#102334"))
        pdf.roundRect(bx, 20 * mm, chip_w, 8 * mm, 3, fill=1, stroke=0)
        pdf.setFont(font_bold, 5.4)
        pdf.setFillColor(white)
        pdf.drawCentredString(bx + chip_w / 2, 23 * mm, module)

    # Official RAVI artwork from the game (final stage 9).
    rx = width - margin - 92 * mm
    ry = 30 * mm

    # Subtle halo behind RAVI only; the robot itself stays fully opaque.
    pdf.setFillColor(Color(0.9, 0.1, 0.15, alpha=0.055))
    pdf.circle(rx + 46 * mm, ry + 62 * mm, 50 * mm, fill=1, stroke=0)

    if ravi_image_path.exists():
        try:
            ravi = ImageReader(str(ravi_image_path))
            img_w, img_h = ravi.getSize()
            target_h = 124 * mm
            target_w = target_h * (img_w / img_h)
            if target_w > 90 * mm:
                target_w = 90 * mm
                target_h = target_w * (img_h / img_w)

            ravi_x = rx + (92 * mm - target_w) / 2
            ravi_y = ry + 1 * mm

            pdf.drawImage(
                ravi,
                ravi_x,
                ravi_y,
                width=target_w,
                height=target_h,
                preserveAspectRatio=True,
                mask="auto",
            )
        except Exception as exc:
            print(f"Certificate RAVI render failed: {exc}")

    pdf.setFont(font_bold, 8)
    pdf.setFillColor(red)
    pdf.drawCentredString(rx + 46 * mm, ry - 2 * mm, "RAVI // ONLINE")

    # Footer.
    pdf.setStrokeColor(HexColor("#2C4053"))
    pdf.setLineWidth(0.8)
    pdf.line(x0, 14 * mm, width - margin - 5 * mm, 14 * mm)

    pdf.setFont(font_regular, 7.5)
    pdf.setFillColor(muted)
    pdf.drawString(x0, 8 * mm, f"{date_label}  •  Srednja šola Ravne")
    pdf.drawRightString(
        width - margin - 5 * mm,
        8 * mm,
        "RAVI INFO MISIJA  •  MISSION COMPLETE",
    )

    pdf.showPage()
    pdf.save()
    return buffer.getvalue()


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
