from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.base import CampaignCreate, Campaign
from app.models.base import Campaign as CampaignModel, CampaignStatus
from app.utils.db import get_db
# from app.celery_app import celery_app # for background tasks later

router = APIRouter(prefix="/ai", tags=["ai"])

@router.post("/generate-content", response_model=Campaign)
def generate_content(campaign_in: CampaignCreate, db: Session = Depends(get_db)):
    # Simple mock generator for now
    # In Phase 2/3 we would call OpenAI/Anthropic here
    content = campaign_in.content
    if "caption" not in content:
        content["caption"] = f"Check out our latest services in {campaign_in.platform}!"
    if "hashtags" not in content:
        content["hashtags"] = "#marketing #ai #growth"
        
    new_campaign = CampaignModel(
        business_id=campaign_in.business_id,
        platform=campaign_in.platform,
        content=content,
        status=CampaignStatus.DRAFT,
        scheduled_time=campaign_in.scheduled_time
    )
    db.add(new_campaign)
    db.commit()
    db.refresh(new_campaign)
    return new_campaign
