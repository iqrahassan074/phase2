from uuid import UUID
from sqlmodel import Session, select
from passlib.hash import bcrypt
from . import models, schemas

def get_user(db: Session, user_id: UUID):
    return db.get(models.User, user_id)

def get_user_by_email(db: Session, email: str):
    return db.exec(select(models.User).where(models.User.email == email)).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = bcrypt.hash(user.password)
    db_user = models.User(email=user.email, name=user.name, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_tasks(db: Session, user_id: UUID, skip: int = 0, limit: int = 100):
    return db.exec(select(models.Task).where(models.Task.user_id == user_id).offset(skip).limit(limit)).all()

def get_task(db: Session, task_id: int, user_id: UUID):
    return db.exec(select(models.Task).where(models.Task.id == task_id).where(models.Task.user_id == user_id)).first()

def create_task(db: Session, task: schemas.TaskCreate, user_id: UUID):
    db_task = models.Task(**task.model_dump(), user_id=user_id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def update_task(db: Session, db_task: models.Task, task_in: schemas.TaskUpdate):
    task_data = task_in.model_dump(exclude_unset=True)
    for key, value in task_data.items():
        setattr(db_task, key, value)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def toggle_task_completion(db: Session, db_task: models.Task, completed: bool):
    db_task.completed = completed
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def delete_task(db: Session, db_task: models.Task):
    db.delete(db_task)
    db.commit()
