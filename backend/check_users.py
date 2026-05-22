from sqlalchemy import create_engine, text
import os

DB_URL = "sqlite:///./resumeai.db"
engine = create_engine(DB_URL)

with engine.connect() as connection:
    result = connection.execute(text("SELECT id, email, username FROM users"))
    users = result.fetchall()
    if not users:
        print("No users found in database.")
    for user in users:
        print(f"ID: {user[0]}, Email: {user[1]}, Username: {user[2]}")
