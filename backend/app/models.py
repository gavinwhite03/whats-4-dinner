from sqlalchemy import Column, Integer, String, Boolean
from .database import Base

class GroceryItem(Base):
    __tablename__ = "grocery_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    quantity = Column(Integer, default=1)
    have = Column(Boolean, default=True)  # True if in inventory
    need = Column(Boolean, default=False) # True if on shopping list
