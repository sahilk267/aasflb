from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.utils.db import get_db
from app.schemas.base import BusinessCreate, Business, BusinessUpdate, LeadCreate, Lead
from app.utils.deps import get_current_user
from app.models.base import Business as BusinessModel, Lead as LeadModel, User

router = APIRouter(prefix="/businesses", tags=["businesses"])

@router.post("/", response_model=Business)
def create_business(
    business_in: BusinessCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_business = BusinessModel(**business_in.model_dump(), user_id=current_user.id)
    db.add(new_business)
    db.commit()
    db.refresh(new_business)
    return new_business

@router.get("/", response_model=List[Business])
def list_businesses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(BusinessModel).filter(BusinessModel.user_id == current_user.id).all()

@router.put("/{business_id}", response_model=Business)
def update_business(
    business_id: int,
    business_in: BusinessUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_business = db.query(BusinessModel).filter(
        BusinessModel.id == business_id,
        BusinessModel.user_id == current_user.id
    ).first()
    if not db_business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    update_data = business_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_business, key, value)
    
    db.commit()
    db.refresh(db_business)
    return db_business

@router.delete("/{business_id}")
def delete_business(
    business_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_business = db.query(BusinessModel).filter(
        BusinessModel.id == business_id,
        BusinessModel.user_id == current_user.id
    ).first()
    if not db_business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    db.delete(db_business)
    db.commit()
    return {"message": "Business deleted"}

@router.post("/{business_id}/leads", response_model=Lead)
def create_lead(
    business_id: int, 
    lead_in: LeadCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify business ownership
    business = db.query(BusinessModel).filter(
        BusinessModel.id == business_id, 
        BusinessModel.user_id == current_user.id
    ).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
        
    new_lead = LeadModel(**lead_in.model_dump(exclude={"business_id"}), business_id=business_id)
    db.add(new_lead)
    db.commit()
    db.refresh(new_lead)
    return new_lead

@router.get("/{business_id}/leads", response_model=List[Lead])
def list_leads(
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
        raise HTTPException(status_code=404, detail="Business not found")
        
    return db.query(LeadModel).filter(LeadModel.business_id == business_id).all()

@router.delete("/leads/{lead_id}")
def delete_lead(
    lead_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify ownership through business
    lead = db.query(LeadModel).join(BusinessModel).filter(
        LeadModel.id == lead_id,
        BusinessModel.user_id == current_user.id
    ).first()
    
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found or access denied")
        
    db.delete(lead)
    db.commit()
    return {"message": "Lead deleted"}
