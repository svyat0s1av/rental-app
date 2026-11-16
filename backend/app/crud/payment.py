from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.payment import Payment, PaymentStatus
from app.schemas.payment import PaymentCreate

async def create_payment(db: AsyncSession, payment_in: PaymentCreate) -> Payment:
    db_payment = Payment(**payment_in.model_dump())
    db.add(db_payment)
    await db.commit()
    await db.refresh(db_payment)
    return db_payment

async def get_payments_for_contract(db: AsyncSession, contract_id: int) -> list[Payment]:
    result = await db.execute(select(Payment).where(Payment.contract_id == contract_id))
    return list(result.scalars().all())

async def attach_receipt(db: AsyncSession, payment_id: int, receipt_url: str) -> Payment | None:
    payment = await db.get(Payment, payment_id)
    if payment:
        payment.receipt_url = receipt_url
        payment.status = PaymentStatus.PAID.value
        await db.commit()
        await db.refresh(payment)
    return payment
