from .celery_app import celery_app
from .models.base import Campaign, CampaignStatus
from .utils.db import SessionLocal
import logging

logger = logging.getLogger(__name__)

@celery_app.task(name="execute_post")
def execute_post(campaign_id: int):
    db = SessionLocal()
    try:
        campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
        if not campaign:
            logger.error(f"Campaign {campaign_id} not found")
            return
        
        logger.info(f"Executing post for campaign {campaign_id} on {campaign.platform}")
        
        # Simulate API call to social media platform
        # In a real app, this would use platform-specific SDKs
        
        campaign.status = CampaignStatus.POSTED
        db.commit()
        logger.info(f"Campaign {campaign_id} marked as POSTED")
    except Exception as e:
        logger.error(f"Error executing post {campaign_id}: {str(e)}")
        if campaign:
            campaign.status = CampaignStatus.FAILED
            db.commit()
    finally:
        db.close()

@celery_app.task(name="check_scheduled_posts")
def check_scheduled_posts():
    db = SessionLocal()
    try:
        # Check for campaigns that are scheduled and the time has passed
        from datetime import datetime
        now = datetime.utcnow()
        
        pending_campaigns = db.query(Campaign).filter(
            Campaign.status == CampaignStatus.SCHEDULED,
            Campaign.scheduled_time <= now
        ).all()
        
        for campaign in pending_campaigns:
            execute_post.delay(campaign.id)
            
    finally:
        db.close()
