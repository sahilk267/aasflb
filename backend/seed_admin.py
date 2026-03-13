from sqlalchemy.orm import Session
from app.utils.db import SessionLocal
from app.models.base import User, UserRole
from app.utils.auth import get_password_hash

def seed_user():
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == "admin@autogrowth.com").first()
        if not user:
            new_user = User(
                name="Admin User",
                email="admin@autogrowth.com",
                password_hash=get_password_hash("admin123"),
                role=UserRole.ADMIN
            )
            db.add(new_user)
            db.commit()
            print("Admin user created successfully!")
        else:
            print("Admin user already exists.")
    except Exception as e:
        print(f"Error seeding user: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_user()
