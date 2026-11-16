from pydantic import BaseModel, Field
from typing import Optional, List

class PropertyBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    description: Optional[str] = None
    address: str = Field(..., min_length=5)
    rooms: int = Field(..., ge=1)
    area: float = Field(..., gt=0)
    price: int = Field(..., gt=0)

class PropertyCreate(PropertyBase):
    image_urls: Optional[List[str]] = []

class PropertyImageResponse(BaseModel):
    id: int
    url: str

    class Config:
        from_attributes = True

class PropertyResponse(PropertyBase):
    id: int
    owner_id: int
    images: List[PropertyImageResponse] = []

    class Config:
        from_attributes = True