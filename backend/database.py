from sqlmodel import create_engine, SQLModel

DATABASE_URL = "postgresql://user:password@host/database_name" # Placeholder - REPLACE WITH ACTUAL NEON DB URL

engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
