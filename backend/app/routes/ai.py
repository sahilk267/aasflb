from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.base import CampaignCreate, Campaign, AIContentRequest, AIContentResponse
from app.utils.db import get_db
from app.utils.deps import get_current_user
from app.models.base import Campaign as CampaignModel, CampaignStatus, User, Business as BusinessModel
from app.services.ai_service import generate_campaign_content

router = APIRouter(prefix="/ai", tags=["ai"])

@router.post("/generate", response_model=AIContentResponse)
def generate_preview(
    req: AIContentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    business = db.query(BusinessModel).filter(
        BusinessModel.id == req.business_id,
        BusinessModel.user_id == current_user.id
    ).first()
    
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
        
    text = generate_campaign_content(
        business_name=business.name,
        niche=business.niche,
        audience=business.target_audience,
        tone=business.tone,
        platform=req.platform
    )
    
    from app.services.ai_service import generate_image_prompt, get_image_url
    image_prompt = generate_image_prompt(text)
    image_url = get_image_url(image_prompt)
    
    return AIContentResponse(content=text, image_url=image_url)

@router.post("/generate-content", response_model=Campaign)
def generate_content(
    campaign_in: CampaignCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    business = db.query(BusinessModel).filter(
        BusinessModel.id == campaign_in.business_id,
        BusinessModel.user_id == current_user.id
    ).first()
    
    if not business:
        raise HTTPException(status_code=404, detail="Business not found or access denied")

    text = generate_campaign_content(
        business_name=business.name,
        niche=business.niche,
        audience=business.target_audience,
        tone=business.tone,
        platform=campaign_in.platform
    )
    
    content = campaign_in.content
    content["text"] = text
        
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
