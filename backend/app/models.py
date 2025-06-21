from sqlalchemy import Column, Integer, String, Boolean, Text, Table, ForeignKey
from sqlalchemy.orm import relationship

from .groceries_db import Base
from pydantic import BaseModel
from typing import Optional

# Many-to-many association table
recipe_ingredients_table = Table(
    "recipe_ingredients",
    Base.metadata,
    Column("recipe_id", Integer, ForeignKey("recipes.id"), primary_key=True),
    Column("grocery_item_id", Integer, ForeignKey("grocery_items.id"), primary_key=True),
    Column("quantity", Integer, default=1),
    Column("unit", String, default="")
)
    
class GroceryItem(Base):
    __tablename__ = "grocery_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    quantity = Column(Integer, default=1)
    unit = Column(String, default="")
    have = Column(Boolean, default=True)
    need = Column(Boolean, default=False)
    category = Column(String, default="general")

    recipes = relationship(
        "Recipe",
        secondary=recipe_ingredients_table,
        back_populates="ingredients"
    )
class GroceryItemCreate(BaseModel):
    name: str
    quantity: int = 1
    unit: str
    category: str = 'general'
    have: bool = False
    need: bool = True

class PantryItemCreate(BaseModel):
    name: str
    quantity: int = 1
    unit: str
    category: str = 'general'
    have: bool = True
    need: bool = False
class GroceryItemResponse(BaseModel):
    id: int
    name: str
    quantity: int
    unit: str
    category: str = 'general'
    have: bool
    need: bool

    class Config:
        from_attributes = True

class GroceryItemUpdate(BaseModel):
    name: Optional[str] = None
    quantity: Optional[int] = None
    unit: Optional[str] = None
    category: Optional[str] = 'general'
    have: Optional[bool] = None
    need: Optional[bool] = None

    class Config:
        from_attributes = True
        
# Recipes Database

class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    instructions = Column(Text)
    category = Column(String, default="general")

    ingredients = relationship(
        "GroceryItem",
        secondary=recipe_ingredients_table,
        back_populates="recipes"
    )
    
class RecipeCreate(BaseModel):
    title: str
    instructions: str
    ingredients: str
    category: str = "general"

class RecipeResponse(RecipeCreate):
    id: int

    class Config:
        from_attributes = True