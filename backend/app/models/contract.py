import enum
from sqlalchemy import String, Integer, ForeignKey, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from app.db.base import Base

class ContractStatus(str, enum.Enum):
    DRAFT = "draft"
    SIGNED = "signed"
    ACTIVE = "active"
    CLOSED = "closed"

class Contract(Base):
    __tablename__ = "contracts"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    property_id: Mapped[int] = mapped_column(ForeignKey("properties.id"))
    renter_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    start_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    end_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default=ContractStatus.SIGNED.value)
    document_url: Mapped[str | None] = mapped_column(String(255), nullable=True)

    property: Mapped["Property"] = relationship("Property", back_populates="contracts")
    renter: Mapped["User"] = relationship("User", foreign_keys=[renter_id])
    payments: Mapped[list["Payment"]] = relationship("Payment", back_populates="contract")
