from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User, UserRole
from app.models.property import Property
from app.schemas.property import PropertyCreate, PropertyResponse
from app.crud import property as crud_property

router = APIRouter()

@router.post("/", response_model=PropertyResponse)
async def create_new_property(
    property_in: PropertyCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in (UserRole.OWNER, UserRole.ADMIN):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Добавлять объекты могут только арендодатели"
        )
    return await crud_property.create_property(db, property_in, owner_id=current_user.id)

@router.get("/", response_model=list[PropertyResponse])
async def read_properties(db: AsyncSession = Depends(get_db)):
    return await crud_property.get_properties(db)

@router.get("/my", response_model=list[PropertyResponse])
async def read_my_properties(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Property)
        .options(selectinload(Property.images))
        .where(Property.owner_id == current_user.id)
    )
    return list(result.scalars().all())

@router.get("/{property_id}", response_model=PropertyResponse)
async def read_property(property_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Property)
        .options(selectinload(Property.images))
        .where(Property.id == property_id)
    )
    prop = result.scalar_one_or_none()
    if not prop:
        raise HTTPException(status_code=404, detail="Квартира не найдена")
    return prop
