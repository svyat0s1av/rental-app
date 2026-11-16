from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from app.models.contract import Contract, ContractStatus
from app.models.property import Property
from app.schemas.contract import ContractCreate

async def create_contract(db: AsyncSession, contract_in: ContractCreate, renter_id: int) -> Contract:
    data = contract_in.model_dump()
    if data["start_date"].tzinfo is not None:
        data["start_date"] = data["start_date"].replace(tzinfo=None)
    if data["end_date"].tzinfo is not None:
        data["end_date"] = data["end_date"].replace(tzinfo=None)

    db_contract = Contract(**data, renter_id=renter_id, status=ContractStatus.SIGNED.value)
    db.add(db_contract)
    await db.commit()
    await db.refresh(db_contract)
    return db_contract

async def get_contracts_for_user(db: AsyncSession, user_id: int) -> list[Contract]:
    result = await db.execute(
        select(Contract)
        .join(Property, Contract.property_id == Property.id)
        .where(or_(Contract.renter_id == user_id, Property.owner_id == user_id))
    )
    return list(result.scalars().all())
