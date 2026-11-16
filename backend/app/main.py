import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.db.base import Base
from app.db.session import engine
from app.models.user import User
from app.models.property import Property, PropertyImage
from app.models.contract import Contract
from app.models.payment import Payment
from app.api.routes import auth, properties, contracts, payments, files, users

os.makedirs("uploads", exist_ok=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(title="Rental API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(properties.router, prefix="/api/properties", tags=["Properties"])
app.include_router(contracts.router, prefix="/api/contracts", tags=["Contracts"])
app.include_router(payments.router, prefix="/api/payments", tags=["Payments"])
app.include_router(files.router, prefix="/api/files", tags=["Files"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])

@app.get("/")
def read_root():
    return {"message": "API работает!"}
