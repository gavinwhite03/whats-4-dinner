from sqlalchemy import Column, Integer, String, Boolean
from .database import Base
from pydantic import BaseModel
from typing import Optional

class GroceryItem(Base):
    __tablename__ = "grocery_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    unit = Column(String, index=True)
    quantity = Column(Integer, default=1)
    have = Column(Boolean, default=True)  # True if in inventory
    need = Column(Boolean, default=False) # True if on shopping list
    
class GroceryItemCreate(BaseModel):
    name: str
    quantity: int = 1
    unit: str
    have: bool = False
    need: bool = True

class PantryItemCreate(BaseModel):
    name: str
    quantity: int = 1
    unit: str
    have: bool = True
    need: bool = False
class GroceryItemResponse(BaseModel):
    id: int
    name: str
    quantity: int
    have: bool
    need: bool

    class Config:
        from_attributes = True

class GroceryItemUpdate(BaseModel):
    name: Optional[str] = None
    quantity: Optional[int] = None
    unit: Optional[str] = None
    have: Optional[bool] = None
    need: Optional[bool] = None

    class Config:
        from_attributes = True