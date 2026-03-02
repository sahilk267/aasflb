from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.utils.db import get_db
from app.schemas.base import CampaignCreate, Campaign, CampaignUpdate
from app.models.base import Campaign as CampaignModel, CampaignStatus
from datetime import datetime

router = APIRouter(prefix="/campaigns", tags=["campaigns"])

@router.post("/", response_model=Campaign)
def create_campaign(campaign_in: CampaignCreate, db: Session = Depends(get_db)):
    new_campaign = CampaignModel(**campaign_in.model_dump())
    db.add(new_campaign)
    db.commit()
    db.refresh(new_campaign)
    return new_campaign

@router.get("/{campaign_id}", response_model=Campaign)
def get_campaign(campaign_id: int, db: Session = Depends(get_db)):
    campaign = db.query(CampaignModel).filter(CampaignModel.id == campaign_id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign

@router.put("/{campaign_id}", response_model=Campaign)
def update_campaign(campaign_id: int, campaign_in: CampaignUpdate, db: Session = Depends(get_db)):
    db_campaign = db.query(CampaignModel).filter(CampaignModel.id == campaign_id).first()
    if not db_campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    update_data = campaign_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_campaign, key, value)
    
    db.commit()
    db.refresh(db_campaign)
    return db_campaign

@router.delete("/{campaign_id}")
def delete_campaign(campaign_id: int, db: Session = Depends(get_db)):
    db_campaign = db.query(CampaignModel).filter(CampaignModel.id == campaign_id).first()
    if not db_campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    db.delete(db_campaign)
    db.commit()
    return {"message": "Campaign deleted"}
