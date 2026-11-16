from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.property import Property
from app.models.contract import Contract
from app.schemas.contract import ContractCreate, ContractResponse, ContractDocumentUpdate
from app.crud import contract as crud_contract

router = APIRouter()

@router.post("/", response_model=ContractResponse)
async def create_new_contract(
    contract_in: ContractCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    prop = await db.get(Property, contract_in.property_id)
    if not prop:
        raise HTTPException(status_code=404, detail="Квартира не найдена")
    if prop.owner_id == current_user.id:
        raise HTTPException(status_code=400, detail="Нельзя арендовать собственную квартиру")
    return await crud_contract.create_contract(db, contract_in, renter_id=current_user.id)

@router.get("/my", response_model=list[ContractResponse])
async def read_my_contracts(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await crud_contract.get_contracts_for_user(db, current_user.id)

@router.patch("/{contract_id}/document", response_model=ContractResponse)
async def update_contract_document(
    contract_id: int,
    doc_in: ContractDocumentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    contract = await db.get(Contract, contract_id)
    if not contract:
        raise HTTPException(status_code=404, detail="Договор не найден")
    contract.document_url = doc_in.document_url
    await db.commit()
    await db.refresh(contract)
    return contract
