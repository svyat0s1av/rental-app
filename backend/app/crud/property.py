from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.models.property import Property, PropertyImage
from app.schemas.property import PropertyCreate

async def create_property(db: AsyncSession, property_in: PropertyCreate, owner_id: int) -> Property:
    image_urls = property_in.image_urls or []
    property_data = property_in.model_dump(exclude={"image_urls"})
    db_property = Property(**property_data, owner_id=owner_id)
    db.add(db_property)
    await db.flush()

    for url in image_urls:
        db_image = PropertyImage(url=url, property_id=db_property.id)
        db.add(db_image)

    await db.commit()
    
    result = await db.execute(
        select(Property)
        .options(selectinload(Property.images))
        .where(Property.id == db_property.id)
    )
    return result.scalar_one()

async def get_properties(db: AsyncSession) -> list[Property]:
    result = await db.execute(
        select(Property).options(selectinload(Property.images))
    )
    return list(result.scalars().all())