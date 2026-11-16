from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ContractCreate(BaseModel):
    property_id: int
    start_date: datetime
    end_date: datetime

class ContractDocumentUpdate(BaseModel):
    document_url: str

class ContractResponse(BaseModel):
    id: int
    property_id: int
    renter_id: int
    start_date: datetime
    end_date: datetime
    status: str
    document_url: Optional[str] = None

    class Config:
        from_attributes = True
