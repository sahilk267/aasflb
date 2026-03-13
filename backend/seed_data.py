import sys
import os
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from app.models.base import User, Business, Campaign, Lead
from app.utils.db import SessionLocal

def seed_test_data():
    db = SessionLocal()
    try:
        # Find admin user
        admin = db.query(User).filter(User.email == "admin@autogrowth.com").first()
        if not admin:
            print("Admin user not found. Run seed_admin.py first.")
            return

        # Check if business exists
        business = db.query(Business).filter(Business.user_id == admin.id).first()
        if not business:
            business = Business(
                name="AutoGrowth Growth Team",
                niche="Marketing Technology",
                target_audience="SaaS Founders",
                user_id=admin.id
            )
            db.add(business)
            db.commit()
            db.refresh(business)
            print(f"Created business: {business.name}")
        else:
            print(f"Business already exists: {business.name}")

        # Add a sample campaign
        if db.query(Campaign).filter(Campaign.business_id == business.id).count() == 0:
            campaign = Campaign(
                business_id=business.id,
                platform="Twitter",
                content={"text": "Revolutionize your growth with AutoGrowth Engine!"},
                status="posted"
            )
            db.add(campaign)
            print("Added sample campaign.")

        # Add a sample lead
        if db.query(Lead).filter(Lead.business_id == business.id).count() == 0:
            lead = Lead(
                business_id=business.id,
                name="Elon Musk",
                email="elon@twitter.com",
                source="Twitter Outreach",
                status="new"
            )
            db.add(lead)
            print("Added sample lead.")

        db.commit()
        print("Test data seeding complete.")

    except Exception as e:
        print(f"Error seeding data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_test_data()
