#silly
import sys
import time
import uuid
import json
import sqlite3
from datetime import date, timedelta
from pathlib import Path

from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv

REPO_ROOT = Path(__file__).resolve().parent.parent

sys.path.insert(0, str(REPO_ROOT / "database"))

from db import init_db, get_connection
from groq_test import analyze_assessment, answer_wellness_question

load_dotenv(REPO_ROOT / ".env")

app = Flask(__name__)
CORS(app)

# Create/update database tables when the API starts.
init_db()


# --------------------------------------------------
# Helper functions
# --------------------------------------------------

def get_request_data():
    """Return JSON request data, or an empty dictionary."""
    data = request.get_json(silent=True)
    return data if isinstance(data, dict) else {}


def _get_user(cur, participant_id):
    """Find a user using their participant ID."""
    if not isinstance(participant_id, str) or not participant_id.strip():
        return None

    row = cur.execute(
        "SELECT id FROM users WHERE participant_id = ?",
        (participant_id.strip(),)
    ).fetchone()

    return row["id"] if row else None


def _decode_checkin(row):
    """Convert a database check-in row into a JSON-friendly dictionary."""
    result = dict(row)

    try:
        result["feelings"] = json.loads(result.get("feelings") or "[]")
    except (json.JSONDecodeError, TypeError):
        result["feelings"] = []

    return result


def _valid_date(value):
    """Check whether a value is a valid YYYY-MM-DD date."""
    if not isinstance(value, str):
        return False

    try:
        date.fromisoformat(value)
        return len(value) == 10
    except ValueError:
        return False


# --------------------------------------------------
# Home
# --------------------------------------------------

@app.route("/", methods=["GET"])
def root():
    return jsonify({
        "status": "ok",
        "message": "Wellness Support API is running"
    }), 200


@app.route("/home", methods=["GET"])
def home():
    return jsonify({"status": "ok"}), 200


# --------------------------------------------------
# Authentication
# --------------------------------------------------

@app.route("/register", methods=["POST"])
def register():
    data = get_request_data()

    email = data.get("email")
    password = data.get("password")
    display_name = data.get("display_name")

    if not isinstance(email, str) or not email.strip():
        return jsonify({"error": "A valid email is required"}), 400

    if not isinstance(password, str) or len(password) < 8:
        return jsonify({
            "error": "Password must contain at least 8 characters"
        }), 400

    if display_name is not None and not isinstance(display_name, str):
        return jsonify({"error": "display_name must be text"}), 400

    email = email.strip().lower()
    display_name = display_name.strip() if display_name else None

    conn = get_connection()

    try:
        participant_id = str(uuid.uuid4())
        password_hash = generate_password_hash(password)

        cur = conn.execute(
            """
            INSERT INTO users
                (participant_id, email, password_hash, display_name)
            VALUES (?, ?, ?, ?)
            """,
            (participant_id, email, password_hash, display_name)
        )

        conn.commit()

        return jsonify({
            "id": cur.lastrowid,
            "participant_id": participant_id,
            "email": email,
            "display_name": display_name
        }), 201

    except sqlite3.IntegrityError:
        conn.rollback()
        return jsonify({
            "error": "An account with this email already exists"
        }), 409

    finally:
        conn.close()


@app.route("/login", methods=["POST"])
def login():
    data = get_request_data()

    email = data.get("email")
    password = data.get("password")

    if not isinstance(email, str) or not email.strip():
        return jsonify({"error": "Email is required"}), 400

    if not isinstance(password, str) or not password:
        return jsonify({"error": "Password is required"}), 400

    conn = get_connection()

    try:
        row = conn.execute(
            "SELECT * FROM users WHERE email = ?",
            (email.strip().lower(),)
        ).fetchone()

        if (
            row is None
            or not row["password_hash"]
            or not check_password_hash(row["password_hash"], password)
        ):
            return jsonify({"error": "Invalid email or password"}), 401

        return jsonify({
            "id": row["id"],
            "participant_id": row["participant_id"],
            "email": row["email"],
            "display_name": row["display_name"]
        }), 200

    finally:
        conn.close()


# --------------------------------------------------
# Assessments
# --------------------------------------------------

@app.route("/assessments", methods=["POST"])
def create_assessment():
    data = get_request_data()

    text_input = data.get("text_input")
    participant_id = data.get("participant_id")

    if not isinstance(text_input, str) or not text_input.strip():
        return jsonify({"error": "text_input is required"}), 400

    if len(text_input) > 10000:
        return jsonify({"error": "Assessment text is too long"}), 400

    if not isinstance(participant_id, str) or not participant_id.strip():
        return jsonify({"error": "participant_id is required"}), 400

    text_input = text_input.strip()
    start_time = time.perf_counter()

    conn = get_connection()

    try:
        user_id = _get_user(conn.cursor(), participant_id)

        if user_id is None:
            return jsonify({"error": "Participant not found"}), 404

        try:
            emotional_label, guidance_text = analyze_assessment(text_input)
        except Exception:
            app.logger.exception("Assessment AI request failed")
            return jsonify({
                "error": "Unable to generate guidance right now. Please try again."
            }), 502

        response_time_ms = int(
            (time.perf_counter() - start_time) * 1000
        )

        cur = conn.execute(
            """
            INSERT INTO assessments
                (user_id, text_input, emotional_label, response_time_ms)
            VALUES (?, ?, ?, ?)
            """,
            (user_id, text_input, emotional_label, response_time_ms)
        )

        assessment_id = cur.lastrowid

        conn.execute(
            """
            INSERT INTO interventions
                (assessment_id, recommendation_text, intervention_type)
            VALUES (?, ?, ?)
            """,
            (assessment_id, guidance_text, "general")
        )

        conn.commit()

        return jsonify({
            "id": assessment_id,
            "text_input": text_input,
            "emotional_label": emotional_label,
            "guidance": guidance_text,
            "response_time_ms": response_time_ms
        }), 201

    finally:
        conn.close()


@app.route("/assessments", methods=["GET"])
def list_assessments():
    participant_id = request.args.get("participant_id")

    if not participant_id:
        return jsonify({"error": "participant_id is required"}), 400

    conn = get_connection()

    try:
        rows = conn.execute(
            """
            SELECT a.*
            FROM assessments a
            JOIN users u ON a.user_id = u.id
            WHERE u.participant_id = ?
            ORDER BY a.submitted_at DESC
            """,
            (participant_id,)
        ).fetchall()

        return jsonify([dict(row) for row in rows]), 200

    finally:
        conn.close()


@app.route("/assessments/<int:assessment_id>", methods=["GET"])
def get_assessment(assessment_id):
    participant_id = request.args.get("participant_id")

    if not participant_id:
        return jsonify({"error": "participant_id is required"}), 400

    conn = get_connection()

    try:
        row = conn.execute(
            """
            SELECT a.*
            FROM assessments a
            JOIN users u ON a.user_id = u.id
            WHERE a.id = ? AND u.participant_id = ?
            """,
            (assessment_id, participant_id)
        ).fetchone()

        if row is None:
            return jsonify({"error": "Assessment not found"}), 404

        return jsonify(dict(row)), 200

    finally:
        conn.close()


@app.route("/assessments/<int:assessment_id>", methods=["PUT"])
def update_assessment(assessment_id):
    data = get_request_data()

    text_input = data.get("text_input")
    participant_id = data.get("participant_id")

    if not isinstance(text_input, str) or not text_input.strip():
        return jsonify({"error": "text_input is required"}), 400

    if not participant_id:
        return jsonify({"error": "participant_id is required"}), 400

    conn = get_connection()

    try:
        cur = conn.execute(
            """
            UPDATE assessments
            SET text_input = ?
            WHERE id = ?
              AND user_id = (
                  SELECT id FROM users WHERE participant_id = ?
              )
            """,
            (text_input.strip(), assessment_id, participant_id)
        )

        if cur.rowcount == 0:
            return jsonify({"error": "Assessment not found"}), 404

        conn.commit()

        return jsonify({
            "id": assessment_id,
            "text_input": text_input.strip()
        }), 200

    finally:
        conn.close()


@app.route("/assessments/<int:assessment_id>", methods=["DELETE"])
def delete_assessment(assessment_id):
    participant_id = request.args.get("participant_id")

    if not participant_id:
        return jsonify({"error": "participant_id is required"}), 400

    conn = get_connection()

    try:
        cur = conn.execute(
            """
            SELECT a.id
            FROM assessments a
            JOIN users u ON a.user_id = u.id
            WHERE a.id = ? AND u.participant_id = ?
            """,
            (assessment_id, participant_id)
        )

        if cur.fetchone() is None:
            return jsonify({"error": "Assessment not found"}), 404

        conn.execute(
            "DELETE FROM interventions WHERE assessment_id = ?",
            (assessment_id,)
        )
        conn.execute(
            "DELETE FROM assessments WHERE id = ?",
            (assessment_id,)
        )

        conn.commit()

        return jsonify({"deleted": assessment_id}), 200

    finally:
        conn.close()


# --------------------------------------------------
# Interventions
# --------------------------------------------------

@app.route("/interventions/<int:assessment_id>", methods=["GET"])
def get_intervention(assessment_id):
    participant_id = request.args.get("participant_id")

    if not participant_id:
        return jsonify({"error": "participant_id is required"}), 400

    conn = get_connection()

    try:
        row = conn.execute(
            """
            SELECT i.*
            FROM interventions i
            JOIN assessments a ON i.assessment_id = a.id
            JOIN users u ON a.user_id = u.id
            WHERE i.assessment_id = ? AND u.participant_id = ?
            ORDER BY i.created_at DESC
            LIMIT 1
            """,
            (assessment_id, participant_id)
        ).fetchone()

        if row is None:
            return jsonify({"error": "Intervention not found"}), 404

        return jsonify(dict(row)), 200

    finally:
        conn.close()


@app.route("/interventions/<int:intervention_id>", methods=["PUT"])
def update_intervention(intervention_id):
    data = get_request_data()

    participant_id = data.get("participant_id")
    recommendation_text = data.get("recommendation_text")

    if (
        not participant_id
        or not isinstance(recommendation_text, str)
        or not recommendation_text.strip()
    ):
        return jsonify({
            "error": "participant_id and recommendation_text are required"
        }), 400

    conn = get_connection()

    try:
        cur = conn.execute(
            """
            UPDATE interventions
            SET recommendation_text = ?
            WHERE id = ?
              AND assessment_id IN (
                  SELECT a.id
                  FROM assessments a
                  JOIN users u ON a.user_id = u.id
                  WHERE u.participant_id = ?
              )
            """,
            (recommendation_text.strip(), intervention_id, participant_id)
        )

        if cur.rowcount == 0:
            return jsonify({"error": "Intervention not found"}), 404

        conn.commit()

        return jsonify({
            "id": intervention_id,
            "recommendation_text": recommendation_text.strip()
        }), 200

    finally:
        conn.close()


@app.route("/interventions/<int:intervention_id>", methods=["DELETE"])
def delete_intervention(intervention_id):
    participant_id = request.args.get("participant_id")

    if not participant_id:
        return jsonify({"error": "participant_id is required"}), 400

    conn = get_connection()

    try:
        cur = conn.execute(
            """
            DELETE FROM interventions
            WHERE id = ?
              AND assessment_id IN (
                  SELECT a.id
                  FROM assessments a
                  JOIN users u ON a.user_id = u.id
                  WHERE u.participant_id = ?
              )
            """,
            (intervention_id, participant_id)
        )

        if cur.rowcount == 0:
            return jsonify({"error": "Intervention not found"}), 404

        conn.commit()

        return jsonify({"deleted": intervention_id}), 200

    finally:
        conn.close()


# --------------------------------------------------
# Mood check-ins
# --------------------------------------------------

@app.route("/checkins", methods=["POST"])
def create_checkin():
    data = get_request_data()

    participant_id = data.get("participant_id")
    mood_value = data.get("mood_value")
    feelings = data.get("feelings", [])
    note = data.get("note", "")
    checkin_date = data.get("checkin_date")

    if not isinstance(participant_id, str) or not participant_id.strip():
        return jsonify({"error": "participant_id is required"}), 400

    if not isinstance(mood_value, (str, int, float)) or isinstance(mood_value, bool):
        return jsonify({"error": "A valid mood_value is required"}), 400

    mood_value = str(mood_value).strip()

    if not mood_value:
        return jsonify({"error": "mood_value cannot be empty"}), 400

    if not isinstance(feelings, list) or not all(
        isinstance(feeling, str) and feeling.strip()
        for feeling in feelings
    ):
        return jsonify({
            "error": "feelings must be a list of non-empty strings"
        }), 400

    feelings = list(dict.fromkeys(
        feeling.strip() for feeling in feelings
    ))

    if not isinstance(note, str):
        return jsonify({"error": "note must be text"}), 400

    note = note.strip()

    if len(note) > 5000:
        return jsonify({"error": "The note is too long"}), 400

    if checkin_date is not None and not _valid_date(checkin_date):
        return jsonify({
            "error": "checkin_date must use YYYY-MM-DD format"
        }), 400

    conn = get_connection()

    try:
        user_id = _get_user(conn.cursor(), participant_id)

        if user_id is None:
            return jsonify({"error": "Participant not found"}), 404

        feelings_json = json.dumps(feelings)

        if checkin_date:
            cur = conn.execute(
                """
                INSERT INTO checkins
                    (user_id, mood_value, feelings, note, checkin_date)
                VALUES (?, ?, ?, ?, ?)
                """,
                (user_id, mood_value, feelings_json, note, checkin_date)
            )
        else:
            cur = conn.execute(
                """
                INSERT INTO checkins
                    (user_id, mood_value, feelings, note)
                VALUES (?, ?, ?, ?)
                """,
                (user_id, mood_value, feelings_json, note)
            )

        conn.commit()
        checkin_id = cur.lastrowid

        saved_row = conn.execute(
            "SELECT * FROM checkins WHERE id = ?",
            (checkin_id,)
        ).fetchone()

        return jsonify(_decode_checkin(saved_row)), 201

    except sqlite3.IntegrityError:
        conn.rollback()
        return jsonify({
            "error": "A check-in already exists for this date"
        }), 409

    finally:
        conn.close()


@app.route("/checkins", methods=["GET"])
def list_checkins():
    participant_id = request.args.get("participant_id")

    if not participant_id:
        return jsonify({"error": "participant_id is required"}), 400

    conn = get_connection()

    try:
        rows = conn.execute(
            """
            SELECT c.*
            FROM checkins c
            JOIN users u ON c.user_id = u.id
            WHERE u.participant_id = ?
            ORDER BY c.checkin_date DESC
            """,
            (participant_id,)
        ).fetchall()

        return jsonify([_decode_checkin(row) for row in rows]), 200

    finally:
        conn.close()


@app.route("/checkins/<int:checkin_id>", methods=["PUT"])
def update_checkin(checkin_id):
    data = get_request_data()

    participant_id = data.get("participant_id")
    mood_value = data.get("mood_value")
    feelings = data.get("feelings", [])
    note = data.get("note", "")

    if not participant_id:
        return jsonify({"error": "participant_id is required"}), 400

    if not isinstance(mood_value, (str, int, float)) or isinstance(mood_value, bool):
        return jsonify({"error": "A valid mood_value is required"}), 400

    mood_value = str(mood_value).strip()

    if not mood_value:
        return jsonify({"error": "mood_value cannot be empty"}), 400

    if not isinstance(feelings, list) or not all(
        isinstance(feeling, str) and feeling.strip()
        for feeling in feelings
    ):
        return jsonify({
            "error": "feelings must be a list of non-empty strings"
        }), 400

    feelings = list(dict.fromkeys(
        feeling.strip() for feeling in feelings
    ))

    if not isinstance(note, str):
        return jsonify({"error": "note must be text"}), 400

    note = note.strip()

    if len(note) > 5000:
        return jsonify({"error": "The note is too long"}), 400

    conn = get_connection()

    try:
        cur = conn.execute(
            """
            UPDATE checkins
            SET mood_value = ?, feelings = ?, note = ?
            WHERE id = ?
              AND user_id = (
                  SELECT id FROM users WHERE participant_id = ?
              )
            """,
            (
                mood_value,
                json.dumps(feelings),
                note,
                checkin_id,
                participant_id
            )
        )

        if cur.rowcount == 0:
            return jsonify({"error": "Check-in not found"}), 404

        conn.commit()

        row = conn.execute(
            "SELECT * FROM checkins WHERE id = ?",
            (checkin_id,)
        ).fetchone()

        return jsonify(_decode_checkin(row)), 200

    finally:
        conn.close()


@app.route("/checkins/<int:checkin_id>", methods=["DELETE"])
def delete_checkin(checkin_id):
    participant_id = request.args.get("participant_id")

    if not participant_id:
        return jsonify({"error": "participant_id is required"}), 400

    conn = get_connection()

    try:
        cur = conn.execute(
            """
            DELETE FROM checkins
            WHERE id = ?
              AND user_id = (
                  SELECT id FROM users WHERE participant_id = ?
              )
            """,
            (checkin_id, participant_id)
        )

        if cur.rowcount == 0:
            return jsonify({"error": "Check-in not found"}), 404

        conn.commit()

        return jsonify({"deleted": checkin_id}), 200

    finally:
        conn.close()


@app.route("/checkins/streak", methods=["GET"])
def get_streak():
    participant_id = request.args.get("participant_id")

    if not participant_id:
        return jsonify({"error": "participant_id is required"}), 400

    conn = get_connection()

    try:
        rows = conn.execute(
            """
            SELECT c.checkin_date
            FROM checkins c
            JOIN users u ON c.user_id = u.id
            WHERE u.participant_id = ?
            ORDER BY c.checkin_date DESC
            """,
            (participant_id,)
        ).fetchall()

        dates = {
            date.fromisoformat(row["checkin_date"])
            for row in rows
        }

    finally:
        conn.close()

    today = date.today()
    cursor = today

    if cursor not in dates:
        cursor = today - timedelta(days=1)

    streak = 0

    while cursor in dates:
        streak += 1
        cursor -= timedelta(days=1)

    return jsonify({
        "participant_id": participant_id,
        "current_streak": streak
    }), 200


@app.route("/checkins/trends", methods=["GET"])
def get_trends():
    participant_id = request.args.get("participant_id")

    if not participant_id:
        return jsonify({"error": "participant_id is required"}), 400

    conn = get_connection()

    try:
        rows = conn.execute(
            """
            SELECT c.checkin_date, c.mood_value, c.feelings
            FROM checkins c
            JOIN users u ON c.user_id = u.id
            WHERE u.participant_id = ?
            ORDER BY c.checkin_date ASC
            """,
            (participant_id,)
        ).fetchall()

        results = []

        for row in rows:
            try:
                feelings = json.loads(row["feelings"] or "[]")
            except (json.JSONDecodeError, TypeError):
                feelings = []

            results.append({
                "date": row["checkin_date"],
                "mood_value": row["mood_value"],
                "feelings": feelings
            })

        return jsonify(results), 200

    finally:
        conn.close()


# --------------------------------------------------
# Resources
# --------------------------------------------------

@app.route("/resources", methods=["POST"])
def create_resource():
    data = get_request_data()

    title = data.get("title")
    category = data.get("category")
    description = data.get("description")
    contact_info = data.get("contact_info")

    if not isinstance(title, str) or not title.strip():
        return jsonify({"error": "title is required"}), 400

    if not isinstance(category, str) or not category.strip():
        return jsonify({"error": "category is required"}), 400

    conn = get_connection()

    try:
        cur = conn.execute(
            """
            INSERT INTO resources
                (title, category, description, contact_info)
            VALUES (?, ?, ?, ?)
            """,
            (
                title.strip(),
                category.strip(),
                description,
                contact_info
            )
        )

        conn.commit()

        return jsonify({
            "id": cur.lastrowid,
            "title": title.strip(),
            "category": category.strip()
        }), 201

    finally:
        conn.close()


@app.route("/resources", methods=["GET"])
def list_resources():
    category = request.args.get("category")
    conn = get_connection()

    try:
        if category:
            rows = conn.execute(
                "SELECT * FROM resources WHERE category = ? ORDER BY title",
                (category,)
            ).fetchall()
        else:
            rows = conn.execute(
                "SELECT * FROM resources ORDER BY title"
            ).fetchall()

        return jsonify([dict(row) for row in rows]), 200

    finally:
        conn.close()


@app.route("/resources/<int:resource_id>", methods=["GET"])
def get_resource(resource_id):
    conn = get_connection()

    try:
        row = conn.execute(
            "SELECT * FROM resources WHERE id = ?",
            (resource_id,)
        ).fetchone()

        if row is None:
            return jsonify({"error": "Resource not found"}), 404

        return jsonify(dict(row)), 200

    finally:
        conn.close()


@app.route("/resources/<int:resource_id>", methods=["PUT"])
def update_resource(resource_id):
    data = get_request_data()

    title = data.get("title")
    category = data.get("category")
    description = data.get("description")
    contact_info = data.get("contact_info")

    if not isinstance(title, str) or not title.strip():
        return jsonify({"error": "title is required"}), 400

    if not isinstance(category, str) or not category.strip():
        return jsonify({"error": "category is required"}), 400

    conn = get_connection()

    try:
        cur = conn.execute(
            """
            UPDATE resources
            SET title = ?, category = ?, description = ?, contact_info = ?
            WHERE id = ?
            """,
            (
                title.strip(),
                category.strip(),
                description,
                contact_info,
                resource_id
            )
        )

        if cur.rowcount == 0:
            return jsonify({"error": "Resource not found"}), 404

        conn.commit()

        return jsonify({
            "id": resource_id,
            "title": title.strip(),
            "category": category.strip()
        }), 200

    finally:
        conn.close()


@app.route("/resources/<int:resource_id>", methods=["DELETE"])
def delete_resource(resource_id):
    conn = get_connection()

    try:
        cur = conn.execute(
            "DELETE FROM resources WHERE id = ?",
            (resource_id,)
        )

        if cur.rowcount == 0:
            return jsonify({"error": "Resource not found"}), 404

        conn.commit()

        return jsonify({"deleted": resource_id}), 200

    finally:
        conn.close()


# --------------------------------------------------
# Wellness chat and conversation history
# --------------------------------------------------


@app.route("/wellness-chats", methods=["POST"])
def create_wellness_chat():
    data = get_request_data()

    participant_id = data.get("participant_id")
    question_text = data.get("question_text")
    conversation_id = data.get("conversation_id")

    if not isinstance(participant_id, str) or not participant_id.strip():
        return jsonify({"error": "participant_id is required"}), 400

    participant_id = participant_id.strip()

    if not isinstance(question_text, str) or not question_text.strip():
        return jsonify({"error": "question_text is required"}), 400

    question_text = question_text.strip()

    if len(question_text) > 5000:
        return jsonify({"error": "Question is too long"}), 400

    if conversation_id is not None:
        try:
            conversation_id = int(conversation_id)
            if conversation_id <= 0:
                raise ValueError
        except (TypeError, ValueError):
            return jsonify({"error": "Invalid conversation_id"}), 400

    conn = get_connection()

    try:
        user_id = _get_user(conn.cursor(), participant_id)

        if user_id is None:
            return jsonify({"error": "Participant not found"}), 404

        if conversation_id is not None:
            conversation = conn.execute(
                """
                SELECT id
                FROM chat_conversations
                WHERE id = ? AND user_id = ?
                """,
                (conversation_id, user_id)
            ).fetchone()

            if conversation is None:
                return jsonify({"error": "Conversation not found"}), 404

        conversation_history = []

        if conversation_id is not None:
            previous_rows = conn.execute(
                """
                SELECT question_text, response_text
                FROM wellness_chats
                WHERE conversation_id = ? AND user_id = ?
                ORDER BY id DESC
                LIMIT 6
                """,
                (conversation_id, user_id)
            ).fetchall()

            previous_rows = list(reversed(previous_rows))

            for row in previous_rows:
                conversation_history.append({
                    "role": "user",
                    "content": row["question_text"]
                })

                if row["response_text"]:
                    conversation_history.append({
                        "role": "assistant",
                        "content": row["response_text"]
                    })

        mood_rows = conn.execute(
            """
            SELECT checkin_date, mood_value, feelings, note
            FROM checkins
            WHERE user_id = ?
            ORDER BY checkin_date DESC, id DESC
            LIMIT 7
            """,
            (user_id,)
        ).fetchall()

        mood_context = [
            {
                "checkin_date": row["checkin_date"],
                "mood_value": row["mood_value"],
                "feelings": row["feelings"],
                "note": row["note"]
            }
            for row in mood_rows
        ]

        try:
            response_text = answer_wellness_question(
                question_text,
                conversation_history,
                mood_context=mood_context
            )
        except Exception:
            app.logger.exception("Wellness chat AI request failed")
            return jsonify({
                "error": (
                    "Unable to generate a response right now. "
                    "Please try again."
                )
            }), 502

        if not isinstance(response_text, str) or not response_text.strip():
            return jsonify({
                "error": (
                    "The AI returned an empty response. "
                    "Please try again."
                )
            }), 502

        response_text = response_text.strip()

        if conversation_id is None:
            title = question_text[:60]

            cur = conn.execute(
                """
                INSERT INTO chat_conversations (user_id, title)
                VALUES (?, ?)
                """,
                (user_id, title)
            )

            conversation_id = cur.lastrowid

        cur = conn.execute(
            """
            INSERT INTO wellness_chats
                (user_id, question_text, response_text, conversation_id)
            VALUES (?, ?, ?, ?)
            """,
            (
                user_id,
                question_text,
                response_text,
                conversation_id
            )
        )

        chat_id = cur.lastrowid

        conn.execute(
            """
            UPDATE chat_conversations
            SET updated_at = CURRENT_TIMESTAMP
            WHERE id = ? AND user_id = ?
            """,
            (conversation_id, user_id)
        )

        conn.commit()

        return jsonify({
            "id": chat_id,
            "conversation_id": conversation_id,
            "question_text": question_text,
            "response_text": response_text
        }), 201

    except sqlite3.Error:
        conn.rollback()
        app.logger.exception("Database error while saving wellness chat")

        return jsonify({
            "error": "Unable to save your message right now."
        }), 500

    finally:
        conn.close()


@app.route("/wellness-conversations", methods=["GET"])
def get_wellness_conversations():
    participant_id = request.args.get("participant_id")

    if not participant_id:
        return jsonify({"error": "participant_id is required"}), 400

    conn = get_connection()

    try:
        user_id = _get_user(conn.cursor(), participant_id)

        if user_id is None:
            return jsonify({"error": "Participant not found"}), 404

        rows = conn.execute(
            """
            SELECT
                c.id,
                c.title,
                c.created_at,
                c.updated_at,
                (
                    SELECT wc.question_text
                    FROM wellness_chats wc
                    WHERE wc.conversation_id = c.id
                      AND wc.user_id = c.user_id
                    ORDER BY wc.id DESC
                    LIMIT 1
                ) AS last_question
            FROM chat_conversations c
            WHERE c.user_id = ?
            ORDER BY c.updated_at DESC, c.id DESC
            """,
            (user_id,)
        ).fetchall()

        conversations = [
            {
                "id": row["id"],
                "title": row["title"],
                "created_at": row["created_at"],
                "updated_at": row["updated_at"],
                "last_question": row["last_question"]
            }
            for row in rows
        ]

        return jsonify(conversations), 200

    except sqlite3.Error:
        app.logger.exception("Could not load wellness conversations")

        return jsonify({
            "error": "Unable to load conversations right now."
        }), 500

    finally:
        conn.close()


@app.route("/wellness-chats", methods=["GET"])
def get_wellness_chat_history():
    participant_id = request.args.get("participant_id")
    conversation_id = request.args.get("conversation_id")

    if not participant_id:
        return jsonify({"error": "participant_id is required"}), 400

    if not conversation_id:
        return jsonify({"error": "conversation_id is required"}), 400

    try:
        conversation_id = int(conversation_id)

        if conversation_id <= 0:
            raise ValueError

    except (TypeError, ValueError):
        return jsonify({"error": "Invalid conversation_id"}), 400

    conn = get_connection()

    try:
        user_id = _get_user(conn.cursor(), participant_id)

        if user_id is None:
            return jsonify({"error": "Participant not found"}), 404

        conversation = conn.execute(
            """
            SELECT id
            FROM chat_conversations
            WHERE id = ? AND user_id = ?
            """,
            (conversation_id, user_id)
        ).fetchone()

        if conversation is None:
            return jsonify({"error": "Conversation not found"}), 404

        rows = conn.execute(
            """
            SELECT id, conversation_id, question_text, response_text
            FROM wellness_chats
            WHERE conversation_id = ? AND user_id = ?
            ORDER BY id ASC
            """,
            (conversation_id, user_id)
        ).fetchall()

        messages = [
            {
                "id": row["id"],
                "conversation_id": row["conversation_id"],
                "question_text": row["question_text"],
                "response_text": row["response_text"]
            }
            for row in rows
        ]

        return jsonify(messages), 200

    except sqlite3.Error:
        app.logger.exception("Could not load wellness chat history")

        return jsonify({
            "error": "Unable to load chat history right now."
        }), 500

    finally:
        conn.close()


@app.route(
    "/wellness-conversations/<int:conversation_id>",
    methods=["DELETE"]
)
def delete_wellness_conversation(conversation_id):
    participant_id = request.args.get("participant_id")

    if not participant_id:
        return jsonify({"error": "participant_id is required"}), 400

    conn = get_connection()

    try:
        user_id = _get_user(conn.cursor(), participant_id)

        if user_id is None:
            return jsonify({"error": "Participant not found"}), 404

        conversation = conn.execute(
            """
            SELECT id
            FROM chat_conversations
            WHERE id = ? AND user_id = ?
            """,
            (conversation_id, user_id)
        ).fetchone()

        if conversation is None:
            return jsonify({"error": "Conversation not found"}), 404

        conn.execute(
            """
            DELETE FROM wellness_chats
            WHERE conversation_id = ? AND user_id = ?
            """,
            (conversation_id, user_id)
        )

        conn.execute(
            """
            DELETE FROM chat_conversations
            WHERE id = ? AND user_id = ?
            """,
            (conversation_id, user_id)
        )

        conn.commit()

        return jsonify({
            "message": "Conversation deleted successfully."
        }), 200

    except sqlite3.Error:
        conn.rollback()
        app.logger.exception("Could not delete wellness conversation")

        return jsonify({
            "error": "Unable to delete this conversation right now."
        }), 500

    finally:
        conn.close()



# PERSONALIZED GUIDANCE RECOMMENDATIONS

# --------------------------------------------------
# PERSONALIZED GUIDANCE RECOMMENDATIONS
# --------------------------------------------------

@app.route("/guidance/recommendations", methods=["GET"])
def get_guidance_recommendations():
    participant_id = request.args.get("participant_id")

    if not participant_id:
        return jsonify({
            "error": "participant_id is required"
        }), 400

    conn = get_connection()

    try:
        user_id = _get_user(conn.cursor(), participant_id)

        if user_id is None:
            return jsonify({
                "error": "Participant not found"
            }), 404

        # Get the latest mood check-in.
        checkin = conn.execute(
            """
            SELECT mood_value, feelings, note, checkin_date
            FROM checkins
            WHERE user_id = ?
            ORDER BY checkin_date DESC, id DESC
            LIMIT 1
            """,
            (user_id,)
        ).fetchone()

        # Get the latest AI assessment and its saved guidance.
        assessment = conn.execute(
            """
            SELECT
                a.id,
                a.text_input,
                a.emotional_label,
                a.submitted_at,
                i.recommendation_text
            FROM assessments a
            LEFT JOIN interventions i
                ON i.id = (
                    SELECT i2.id
                    FROM interventions i2
                    WHERE i2.assessment_id = a.id
                    ORDER BY i2.created_at DESC, i2.id DESC
                    LIMIT 1
                )
            WHERE a.user_id = ?
            ORDER BY a.submitted_at DESC, a.id DESC
            LIMIT 1
            """,
            (user_id,)
        ).fetchone()

        # Decode the student's selected feelings.
        mood = ""
        feelings = []
        checkin_note = ""
        checkin_date = None

        if checkin:
            mood = str(
                checkin["mood_value"] or ""
            ).strip().lower()

            checkin_note = str(
                checkin["note"] or ""
            ).strip()

            checkin_date = checkin["checkin_date"]

            try:
                decoded = json.loads(
                    checkin["feelings"] or "[]"
                )
                if isinstance(decoded, list):
                    feelings = [
                        item.strip().lower()
                        for item in decoded
                        if isinstance(item, str) and item.strip()
                    ]
            except (json.JSONDecodeError, TypeError):
                feelings = []

        # Read the existing AI results without making
        # another AI API request.
        ai_emotion = ""
        ai_guidance = ""
        assessment_date = None
        assessment_id = None
        assessment_text = ""

        if assessment:
            ai_emotion = str(
                assessment["emotional_label"] or ""
            ).strip()

            ai_guidance = str(
                assessment["recommendation_text"] or ""
            ).strip()

            assessment_date = assessment["submitted_at"]
            assessment_id = assessment["id"]
            assessment_text = str(
                assessment["text_input"] or ""
            ).strip()

        # Combine emotional information from both sources.
        combined_emotions = set(feelings)

        if ai_emotion:
            combined_emotions.add(ai_emotion.lower())

        # Use the written text as additional context for
        # study-related recommendations.
        assessment_text_lower = assessment_text.lower()

        study_keywords = (
            "assignment", "assignments", "exam", "exams",
            "deadline", "deadlines", "study", "studying",
            "concentrate", "concentration", "coursework"
        )

        study_pressure = any(
            keyword in assessment_text_lower
            for keyword in study_keywords
        )

        stress_emotions = {
            "anxious", "anxiety", "stressed", "stress",
            "overwhelmed", "worried", "nervous"
        }

        tired_emotions = {
            "tired", "exhausted", "drained", "fatigued"
        }

        lonely_emotions = {
            "lonely", "alone", "isolated"
        }

        # Select activities using the check-in and AI results.
        # A low mood takes priority over other activity rules.
        if mood in {"awful", "not great"}:
            title = "Take things one step at a time."
            category = "Gentle support"
            message = (
                "You may be having a difficult day. "
                "Choose one manageable step, and consider "
                "speaking with someone you trust if you need support."
            )
            activities = [
                {
                    "title": "Breathing Exercise",
                    "route": "BreathingExercise"
                },
                {
                    "title": "Talk Things Through",
                    "route": "AIChat"
                }
            ]

        elif combined_emotions.intersection(stress_emotions):
            title = "Give yourself room to breathe."
            category = "Managing stress"
            message = (
                "You don't have to handle everything at once. "
                "Try slowing down, then choose one small step "
                "that feels manageable."
            )
            activities = [
                {
                    "title": "Breathing Exercise",
                    "route": "BreathingExercise"
                },
                {
                    "title": "Focus Timer",
                    "route": "FocusTimer"
                }
            ]

        elif study_pressure:
            title = "Make your workload feel more manageable."
            category = "Study and concentration"
            message = (
                "Your written assessment mentions study-related "
                "work. Consider choosing one task, breaking it "
                "into a smaller step, and taking short breaks."
            )
            activities = [
                {
                    "title": "Focus Timer",
                    "route": "FocusTimer"
                },
                {
                    "title": "Breathing Exercise",
                    "route": "BreathingExercise"
                }
            ]

        elif combined_emotions.intersection(tired_emotions):
            title = "It's okay to slow down."
            category = "Rest and recharge"
            message = (
                "Give yourself permission to pause. "
                "Consider taking a break and choosing "
                "a gentler activity for now."
            )
            activities = [
                {
                    "title": "Breathing Exercise",
                    "route": "BreathingExercise"
                },
                {
                    "title": "Gratitude Journal",
                    "route": "GratitudeJournal"
                }
            ]

        elif combined_emotions.intersection(lonely_emotions):
            title = "You don't have to do everything alone."
            category = "Connection and support"
            message = (
                "Consider reaching out to someone you trust. "
                "You can take things at your own pace."
            )
            activities = [
                {
                    "title": "Talk Things Through",
                    "route": "AIChat"
                },
                {
                    "title": "Gratitude Journal",
                    "route": "GratitudeJournal"
                }
            ]

        elif "calm" in combined_emotions:
            title = "Make space for what helps you feel calm."
            category = "Maintaining balance"
            message = (
                "Notice what is helping you feel settled today. "
                "You could reflect on your progress or prepare "
                "for one manageable task."
            )
            activities = [
                {
                    "title": "Gratitude Journal",
                    "route": "GratitudeJournal"
                },
                {
                    "title": "Focus Timer",
                    "route": "FocusTimer"
                }
            ]

        elif "motivated" in combined_emotions or mood in {
            "good", "amazing"
        }:
            title = "Build on your positive momentum."
            category = "Personal growth"
            message = (
                "Choose one realistic goal and take a small step "
                "towards it. Remember to make time for breaks too."
            )
            activities = [
                {
                    "title": "Focus Timer",
                    "route": "FocusTimer"
                },
                {
                    "title": "Gratitude Journal",
                    "route": "GratitudeJournal"
                }
            ]

        else:
            title = "Find your balance."
            category = "Everyday wellbeing"
            message = (
                "Check in with yourself and choose one small "
                "activity that feels helpful today."
            )
            activities = [
                {
                    "title": "Breathing Exercise",
                    "route": "BreathingExercise"
                },
                {
                    "title": "Gratitude Journal",
                    "route": "GratitudeJournal"
                }
            ]

        # Report which sources were available.
        based_on = []

        if checkin:
            based_on.append("Mood check-in")

        if assessment:
            based_on.append("AI assessment")

        return jsonify({
            "has_checkin": checkin is not None,
            "has_assessment": assessment is not None,
            "title": title,
            "category": category,
            "message": message,
            "based_on": based_on,
            "mood": checkin["mood_value"] if checkin else None,
            "feelings": feelings,
            "checkin_note": checkin_note,
            "checkin_date": checkin_date,
            "ai_emotion": ai_emotion or None,
            "ai_guidance": ai_guidance or None,
            "assessment_id": assessment_id,
            "assessment_date": assessment_date,
            "activities": activities
        }), 200

    except sqlite3.Error:
        app.logger.exception(
            "Could not load personalised guidance"
        )
        return jsonify({
            "error": "Unable to load guidance right now."
        }), 500

    finally:
        conn.close()


# --------------------------------------------------
# Start development server
# --------------------------------------------------

if __name__ == "__main__":
    app.run(
        debug=True,
        host="0.0.0.0",
        port=5000
    )
