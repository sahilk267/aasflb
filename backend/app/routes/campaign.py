from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.utils.db import get_db
from app.schemas.base import CampaignCreate, Campaign, CampaignUpdate
from app.utils.deps import get_current_user
from app.models.base import Campaign as CampaignModel, CampaignStatus, User, Business as BusinessModel

router = APIRouter(prefix="/campaigns", tags=["campaigns"])

@router.post("/", response_model=Campaign)
def create_campaign(
    campaign_in: CampaignCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify business ownership
    business = db.query(BusinessModel).filter(
        BusinessModel.id == campaign_in.business_id, 
        BusinessModel.user_id == current_user.id
    ).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found or access denied")

    new_campaign = CampaignModel(**campaign_in.model_dump())
    db.add(new_campaign)
    db.commit()
    db.refresh(new_campaign)
    return new_campaign

@router.get("/business/{business_id}", response_model=List[Campaign])
def list_business_campaigns(
    business_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify business ownership
    business = db.query(BusinessModel).filter(
        BusinessModel.id == business_id, 
        BusinessModel.user_id == current_user.id
    ).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found or access denied")
        
    return db.query(CampaignModel).filter(CampaignModel.business_id == business_id).all()

@router.get("/{campaign_id}", response_model=Campaign)
def get_campaign(
    campaign_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    campaign = db.query(CampaignModel).join(BusinessModel).filter(
        CampaignModel.id == campaign_id,
        BusinessModel.user_id == current_user.id
    ).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found or access denied")
    return campaign

@router.put("/{campaign_id}", response_model=Campaign)
def update_campaign(
    campaign_id: int, 
    campaign_in: CampaignUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_campaign = db.query(CampaignModel).join(BusinessModel).filter(
        CampaignModel.id == campaign_id,
        BusinessModel.user_id == current_user.id
    ).first()
    if not db_campaign:
        raise HTTPException(status_code=404, detail="Campaign not found or access denied")
    
    update_data = campaign_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_campaign, key, value)
    
    db.commit()
    db.refresh(db_campaign)
    return db_campaign

@router.delete("/{campaign_id}")
def delete_campaign(
    campaign_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_campaign = db.query(CampaignModel).join(BusinessModel).filter(
        CampaignModel.id == campaign_id,
        BusinessModel.user_id == current_user.id
    ).first()
    if not db_campaign:
        raise HTTPException(status_code=404, detail="Campaign not found or access denied")
    
    db.delete(db_campaign)
    db.commit()
    return {"message": "Campaign deleted"}
