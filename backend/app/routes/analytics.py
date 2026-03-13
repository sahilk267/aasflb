from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.utils.db import get_db
from app.utils.deps import get_current_user
from app.models.base import Campaign, CampaignStatus, Lead, Business, User
from datetime import datetime, timedelta
from typing import List, Dict

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/summary/{business_id}")
def get_business_summary(
    business_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    business = db.query(Business).filter(
        Business.id == business_id,
        Business.user_id == current_user.id
    ).first()
    
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
        
    campaign_stats = db.query(
        Campaign.status, func.count(Campaign.id)
    ).filter(Campaign.business_id == business_id).group_by(Campaign.status).all()
    
    stats_dict = {status.value: count for status, count in campaign_stats}
    
    total_leads = db.query(func.count(Lead.id)).filter(Lead.business_id == business_id).scalar()
    
    return {
        "campaigns": {
            "total": sum(stats_dict.values()),
            "draft": stats_dict.get("draft", 0),
            "scheduled": stats_dict.get("scheduled", 0),
            "posted": stats_dict.get("posted", 0),
            "failed": stats_dict.get("failed", 0)
        },
        "leads": {
            "total": total_leads
        }
    }

@router.get("/trends/{business_id}")
def get_business_trends(
    business_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    business = db.query(Business).filter(
        Business.id == business_id,
        Business.user_id == current_user.id
    ).first()
    
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
        
    # Generate last 7 days of lead trends
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=6)
    
    lead_trends = db.query(
        func.date(Lead.created_at).label('date'),
        func.count(Lead.id).label('count')
    ).filter(
        Lead.business_id == business_id,
        Lead.created_at >= start_date
    ).group_by(func.date(Lead.created_at)).all()
    
    trends_dict = {str(date): count for date, count in lead_trends}
    
    # Fill in missing days with 0
    result = []
    for i in range(7):
        day = (start_date + timedelta(days=i)).date()
        date_str = str(day)
        result.append({
            "date": day.strftime("%b %d"),
            "leads": trends_dict.get(date_str, 0)
        })
        
    return result
