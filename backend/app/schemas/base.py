from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from app.models.base import UserRole, CampaignStatus, LeadStatus

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: UserRole = UserRole.CLIENT

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class BusinessBase(BaseModel):
    name: str
    niche: Optional[str] = None
    target_audience: Optional[str] = None
    tone: Optional[str] = "Professional"
    is_autopilot: Optional[bool] = False
    website_url: Optional[str] = None
    specific_page_url: Optional[str] = None
    category: Optional[str] = None
    posting_frequency: Optional[str] = "1"
    logo_url: Optional[str] = None

class BusinessCreate(BusinessBase):
    pass

class BusinessUpdate(BaseModel):
    name: Optional[str] = None
    niche: Optional[str] = None
    target_audience: Optional[str] = None
    tone: Optional[str] = None
    is_autopilot: Optional[bool] = None
    website_url: Optional[str] = None
    specific_page_url: Optional[str] = None
    category: Optional[str] = None
    posting_frequency: Optional[str] = None
    logo_url: Optional[str] = None

class Business(BusinessBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class CampaignBase(BaseModel):
    platform: str
    content: dict
    content_hash: Optional[str] = None
    status: CampaignStatus = CampaignStatus.DRAFT
    scheduled_time: Optional[datetime] = None

class CampaignCreate(CampaignBase):
    business_id: int

class CampaignUpdate(BaseModel):
    platform: Optional[str] = None
    content: Optional[dict] = None
    status: Optional[CampaignStatus] = None
    scheduled_time: Optional[datetime] = None

class Campaign(CampaignBase):
    id: int
    business_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class LeadBase(BaseModel):
    name: str
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    source: str
    status: LeadStatus = LeadStatus.NEW
    followup_date: Optional[datetime] = None

class LeadCreate(LeadBase):
    business_id: int

class Lead(LeadBase):
    id: int
    business_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

class AIContentRequest(BaseModel):
    business_id: int
    platform: str

class AIContentResponse(BaseModel):
    content: str
    image_url: Optional[str] = None

