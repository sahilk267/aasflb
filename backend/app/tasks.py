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
        
        business_name = campaign.business.name if campaign.business else "Unknown Business"
        logger.info(f"🚀 [AutoGrowth Engine] DEPLOYING CAMPAIGN {campaign_id}")
        logger.info(f"📍 Business: {business_name}")
        logger.info(f"📱 Platform: {campaign.platform}")
        logger.info(f"📝 Content: {campaign.content.get('text', 'No content')[:50]}...")
        
        # Simulate API call to social media platform
        import time
        time.sleep(2) # Artificial deployment delay
        
        campaign.status = CampaignStatus.POSTED
        db.commit()
        logger.info(f"✅ Campaign {campaign_id} SUCCESSFULLY POSTED")
    except Exception as e:
        logger.error(f"❌ Error executing post {campaign_id}: {str(e)}")
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

@celery_app.task(name="autopilot_worker")
def autopilot_worker():
    """
    Periodic task to automatically generate and schedule content for Autopilot businesses.
    """
    db = SessionLocal()
    try:
        from .models.base import Business
        from .services.ai_service import generate_campaign_content, generate_content_hash, generate_image_prompt, get_image_url
        from datetime import datetime, timedelta
        import random
        
        now = datetime.utcnow()
        # Find businesses with Autopilot enabled
        autopilot_businesses = db.query(Business).filter(Business.is_autopilot == True).all()
        
        for business in autopilot_businesses:
            # Get target frequency (default to 1 if not set or invalid)
            try:
                target_frequency = int(business.posting_frequency) if business.posting_frequency else 1
            except ValueError:
                target_frequency = 1
            
            # Count scheduled posts for the next 24 hours
            tomorrow = now + timedelta(days=1)
            scheduled_count = db.query(Campaign).filter(
                Campaign.business_id == business.id,
                Campaign.status == CampaignStatus.SCHEDULED,
                Campaign.scheduled_time > now,
                Campaign.scheduled_time < tomorrow
            ).count()
            
            if scheduled_count >= target_frequency:
                continue # Already met or exceeded frequency, skip
            
            # Calculate how many more posts to schedule
            to_schedule = target_frequency - scheduled_count
            
            for i in range(to_schedule):
                # Generate new content
                platform = random.choice(["Twitter", "LinkedIn", "Instagram"])
                text = generate_campaign_content(
                    business_name=business.name,
                    niche=business.niche,
                    audience=business.target_audience,
                    tone=business.tone,
                    platform=platform,
                    category=business.category,
                    website_url=business.website_url,
                    specific_page_url=business.specific_page_url
                )
                
                content_hash = generate_content_hash(text)
                
                # AI Image Generation
                image_prompt = generate_image_prompt(text)
                image_url = get_image_url(image_prompt)
                
                # Strict Deduplication
                exists = db.query(Campaign).filter(
                    Campaign.business_id == business.id,
                    Campaign.content_hash == content_hash
                ).first()
                
                if exists:
                    logger.info(f"Duplicate content detected for business {business.id}, skipping autopilot draft.")
                    continue
                    
                # Spread posts throughout the next 12-24 hours
                # If scheduling multiple, space them out
                delay_hours = random.randint(1, 23)
                scheduled_time = now + timedelta(hours=delay_hours)
                
                new_campaign = Campaign(
                    business_id=business.id,
                    platform=platform,
                    content={
                        "text": text,
                        "image_url": image_url
                    },
                    content_hash=content_hash,
                    status=CampaignStatus.SCHEDULED,
                    scheduled_time=scheduled_time
                )
                db.add(new_campaign)
                db.commit()
                logger.info(f"🤖 [AUTOPILOT] Scheduled {i+1}/{to_schedule} new campaign for business: {business.name}")
            
    except Exception as e:
        logger.error(f"❌ Autopilot worker failed: {str(e)}")
    finally:
        db.close()
