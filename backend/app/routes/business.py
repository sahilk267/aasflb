from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.utils.db import get_db
from app.schemas.base import BusinessCreate, Business, LeadCreate, Lead
from app.models.base import Business as BusinessModel, Lead as LeadModel
# In a real app, we'd add dependency to get current_user here

router = APIRouter(prefix="/businesses", tags=["businesses"])

@router.post("/", response_model=Business)
def create_business(business_in: BusinessCreate, db: Session = Depends(get_db)):
    # Mock user_id=1 for now since auth middleware is pending
    new_business = BusinessModel(**business_in.model_dump(), user_id=1)
    db.add(new_business)
    db.commit()
    db.refresh(new_business)
    return new_business

@router.get("/", response_model=List[Business])
def list_businesses(db: Session = Depends(get_db)):
    return db.query(BusinessModel).all()

@router.post("/{business_id}/leads", response_model=Lead)
def create_lead(business_id: int, lead_in: LeadCreate, db: Session = Depends(get_db)):
    new_lead = LeadModel(**lead_in.model_dump(), business_id=business_id)
    db.add(new_lead)
    db.commit()
    db.refresh(new_lead)
    return new_lead

@router.get("/{business_id}/leads", response_model=List[Lead])
def list_leads(business_id: int, db: Session = Depends(get_db)):
    return db.query(LeadModel).filter(LeadModel.business_id == business_id).all()
