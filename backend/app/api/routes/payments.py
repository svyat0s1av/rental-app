from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.payment import PaymentCreate, PaymentResponse
from app.crud import payment as crud_payment
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter()

class ReceiptUpdate(BaseModel):
    receipt_url: str

@router.post("/", response_model=PaymentResponse)
async def create_new_payment(
    payment_in: PaymentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await crud_payment.create_payment(db, payment_in)

@router.get("/contract/{contract_id}", response_model=list[PaymentResponse])
async def read_contract_payments(
    contract_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await crud_payment.get_payments_for_contract(db, contract_id)

@router.patch("/{payment_id}/receipt", response_model=PaymentResponse)
async def update_payment_receipt(
    payment_id: int,
    receipt_data: ReceiptUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    payment = await crud_payment.attach_receipt(db, payment_id, receipt_data.receipt_url)
    if not payment:
        raise HTTPException(status_code=404, detail="Платеж не найден")
    return payment