
# Database setup

import sqlite3 as sql
import os
from pathlib import Path
from dotenv import load_dotenv


# Find the root folder of the project
REPO_ROOT = Path(__file__).resolve().parent.parent

# Load environment variables from the project's .env file
load_dotenv(REPO_ROOT / ".env")

# Set the location of the SQLite database
DATABASE_PATH = os.getenv(
    "DATABASE_PATH",
    str(REPO_ROOT / "database" / "wellness.db")
)

# Make sure the database folder exists
Path(DATABASE_PATH).parent.mkdir(parents=True, exist_ok=True)


# Database tables
SCHEMA = """
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    participant_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    display_name TEXT,
    privacy_settings TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS checkins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    mood_value TEXT NOT NULL,
    feelings TEXT,
    note TEXT,
    checkin_date DATE NOT NULL
        DEFAULT (date('now', 'localtime')),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE (user_id, checkin_date)
);


CREATE TABLE IF NOT EXISTS assessments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    text_input TEXT NOT NULL,
    emotional_label TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    response_time_ms INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
);


CREATE TABLE IF NOT EXISTS resources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    contact_info TEXT
);


CREATE TABLE IF NOT EXISTS interventions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    assessment_id INTEGER NOT NULL,
    resource_id INTEGER,
    recommendation_text TEXT NOT NULL,
    intervention_type TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assessment_id) REFERENCES assessments(id),
    FOREIGN KEY (resource_id) REFERENCES resources(id)
);


CREATE TABLE IF NOT EXISTS chat_conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL DEFAULT 'New conversation',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);


CREATE TABLE IF NOT EXISTS wellness_chats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    response_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    conversation_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (conversation_id)
        REFERENCES chat_conversations(id)
);


-- Indexes to help common queries run efficiently
CREATE INDEX IF NOT EXISTS idx_assessments_user
ON assessments(user_id);

CREATE INDEX IF NOT EXISTS idx_assessments_submitted
ON assessments(submitted_at);

CREATE INDEX IF NOT EXISTS idx_wellness_chats_user_created
ON wellness_chats(user_id, created_at);

CREATE INDEX IF NOT EXISTS idx_interventions_assessment
ON interventions(assessment_id);

CREATE INDEX IF NOT EXISTS idx_resources_category
ON resources(category);

CREATE INDEX IF NOT EXISTS idx_chat_conversations_user
ON chat_conversations(user_id, updated_at);
"""


# Connect to the database
def get_connection():
    conn = sql.connect(DATABASE_PATH)
    conn.row_factory = sql.Row

    # Enforce foreign key relationships
    conn.execute("PRAGMA foreign_keys = ON")

    return conn


# Create tables and update an existing database if necessary
def init_db():
    conn = get_connection()

    try:
        # Create any missing tables and indexes
        conn.executescript(SCHEMA)

        # Check whether an existing checkins table has the feelings column
        columns = conn.execute(
            "PRAGMA table_info(checkins)"
        ).fetchall()

        column_names = [column["name"] for column in columns]

        # Add the column without deleting existing check-in records
        if "feelings" not in column_names:
            conn.execute(
                "ALTER TABLE checkins ADD COLUMN feelings TEXT"
            )

        # Check whether an existing wellness_chats table has
        # the conversation_id column
        chat_columns = conn.execute(
            "PRAGMA table_info(wellness_chats)"
        ).fetchall()

        chat_column_names = [
            column["name"] for column in chat_columns
        ]

        # Add the column without deleting existing chat records
        if "conversation_id" not in chat_column_names:
            conn.execute("""
                ALTER TABLE wellness_chats
                ADD COLUMN conversation_id INTEGER
                REFERENCES chat_conversations(id)
            """)

        # Create this index after the migration, so it also works
        # when upgrading an existing database
        conn.execute("""
            CREATE INDEX IF NOT EXISTS idx_wellness_chats_conversation
            ON wellness_chats(conversation_id, created_at)
        """)

        conn.commit()

        print(f"Database ready at {DATABASE_PATH}")

    except Exception:
        conn.rollback()
        raise

    finally:
        conn.close()


# Run database setup when this file is executed directly
if __name__ == "__main__":
    init_db()
