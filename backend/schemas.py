from sqlmodel import SQLModel

class TaskCreate(SQLModel):
    title: str
    description: str | None = None

class TaskUpdate(SQLModel):
    title: str | None = None
    description: str | None = None
    completed: bool | None = None

class UserCreate(SQLModel):
    email: str
    name: str
    password: str

class Token(SQLModel):
    access_token: str
    token_type: str
