from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class PaymentBase(BaseModel):
    contract_id: int
    amount: int = Field(..., gt=0)
    description: str

class PaymentCreate(PaymentBase):
    pass

class PaymentResponse(PaymentBase):
    id: int
    status: str
    receipt_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True