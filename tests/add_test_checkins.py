import os
import json
import sqlite3
from pathlib import Path
from dotenv import load_dotenv


# Use the same database configuration as the app.
REPO_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(REPO_ROOT / ".env")

DATABASE_PATH = os.getenv(
    "DATABASE_PATH",
    str(REPO_ROOT / "database" / "wellness.db")
)

TEST_NOTE_PREFIX = "[TEST DATA - remove after testing]"

# Four historical test records.
# Your existing 20 and 21 October records will be preserved.
TEST_CHECKINS = [
    {
        "date": "2026-10-17",
        "mood": "Good",
        "feelings": ["Calm", "Motivated"],
        "stress_level": "Low",
        "sleep_quality": "Good",
        "main_concern": "Academic workload",
    },
    {
        "date": "2026-10-18",
        "mood": "Okay",
        "feelings": ["Worried", "Tired"],
        "stress_level": "Moderate",
        "sleep_quality": "Fair",
        "main_concern": "Academic workload",
    },
    {
        "date": "2026-10-19",
        "mood": "Low",
        "feelings": ["Stressed", "Overwhelmed"],
        "stress_level": "High",
        "sleep_quality": "Poor",
        "main_concern": "Academic workload",
    },
    {
        "date": "2026-10-20",
        "mood": "Low",
        "feelings": ["Anxious", "Tired"],
        "stress_level": "High",
        "sleep_quality": "Poor",
        "main_concern": "Exams and assignments",
    },
]


def main():
    if not Path(DATABASE_PATH).exists():
        print(f"Database not found: {DATABASE_PATH}")
        print("Check that this script is in your project root.")
        return

    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")

    try:
        # Display available accounts without changing anything.
        users = conn.execute("""
            SELECT id, participant_id, display_name
            FROM users
            ORDER BY id
        """).fetchall()

        if not users:
            print("No student accounts found in this database.")
            return

        print("\nAvailable accounts:")
        for user in users:
            print(
                f"Participant ID: {user['participant_id']} | "
                f"Name: {user['display_name'] or 'Not set'}"
            )

        participant_id = input(
            "\nEnter the participant ID to test: "
        ).strip()

        if not participant_id:
            print("No participant ID entered. Nothing changed.")
            return

        user = conn.execute("""
            SELECT id
            FROM users
            WHERE participant_id = ?
        """, (participant_id,)).fetchone()

        if user is None:
            print("Participant ID not found. Nothing changed.")
            return

        user_id = user["id"]

        # Confirm before inserting synthetic records.
        print(
            "\nThis will add synthetic historical check-ins "
            "to the selected account."
        )
        confirm = input("Continue? Type YES: ").strip()

        if confirm != "YES":
            print("Cancelled. Nothing changed.")
            return

        # Verify that the required columns exist.
        columns = {
            row["name"]
            for row in conn.execute(
                "PRAGMA table_info(checkins)"
            ).fetchall()
        }

        required = {
            "user_id",
            "mood_value",
            "feelings",
            "note",
            "checkin_date",
            "stress_level",
            "sleep_quality",
            "main_concern",
        }

        missing = required - columns

        if missing:
            print(
                "Missing database columns: "
                + ", ".join(sorted(missing))
            )
            print("Nothing was inserted.")
            return

        inserted = 0
        skipped = 0

        for item in TEST_CHECKINS:
            # Never overwrite an existing check-in.
            existing = conn.execute("""
                SELECT id
                FROM checkins
                WHERE user_id = ? AND checkin_date = ?
            """, (user_id, item["date"])).fetchone()

            if existing:
                print(
                    f"SKIPPED {item['date']}: "
                    "a check-in already exists."
                )
                skipped += 1
                continue

            note = (
                f"{TEST_NOTE_PREFIX} "
                "Synthetic record for AI pattern testing. "
                "Not a real student self-report."
            )

            conn.execute("""
                INSERT INTO checkins (
                    user_id,
                    mood_value,
                    feelings,
                    note,
                    checkin_date,
                    stress_level,
                    sleep_quality,
                    main_concern
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                user_id,
                item["mood"],
                json.dumps(item["feelings"]),
                note,
                item["date"],
                item["stress_level"],
                item["sleep_quality"],
                item["main_concern"],
            ))

            print(f"INSERTED test check-in: {item['date']}")
            inserted += 1

        conn.commit()

        print("\nTest data insertion complete.")
        print(f"Inserted: {inserted}")
        print(f"Skipped: {skipped}")

        print(
            "\nNext: refresh AI Analysis and inspect the results."
        )
        print(
            "Remember that these are synthetic records, "
            "not actual student responses."
        )

    except Exception as error:
        conn.rollback()
        print(f"Error: {error}")
        print("Changes from this run have been rolled back.")

    finally:
        conn.close()


if __name__ == "__main__":
    main()