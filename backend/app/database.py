from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:////tmp/resumeai.db")

# Supabase / Render / Railway often provide URLs starting with "postgres://"
# but SQLAlchemy 1.4+ requires "postgresql://".
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# For PostgreSQL on serverless (Vercel), try psycopg2 first, fallback to pg8000
if DATABASE_URL.startswith("postgresql://"):
    try:
        import psycopg2
    except ImportError:
        # psycopg2 not available (common on serverless), use pg8000
        DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+pg8000://", 1)

# Only use check_same_thread for SQLite
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(DATABASE_URL, connect_args=connect_args, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"[DB INIT ERROR] {e}")
