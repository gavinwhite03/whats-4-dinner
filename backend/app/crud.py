from sqlalchemy.orm import Session
from . import groceries_db, models
from fastapi import FastAPI, Depends, HTTPException
from . import models
from .models import GroceryItem, GroceryItemCreate, PantryItemCreate

def read_root():
    return {"message": "Grocery API running"}

def get_groceries(db: Session, name=None, need=None, have=None, category=None):
    query = db.query(models.GroceryItem)

    if name:
        query = query.filter(models.GroceryItem.name.ilike(f"%{name}%"))

    if need is not None:
        query = query.filter(models.GroceryItem.need == need)

    if have is not None:
        query = query.filter(models.GroceryItem.have == have)
        
    if category is not None:
        query = query.filter(models.GroceryItem.category == category)

    return query.all()

def get_item(item_id: int, db: Session):
    return db.query(models.GroceryItem).filter(models.GroceryItem.id == item_id).first()

def get_needs(db: Session, need: str):
    return db.query(models.GroceryItem).filter(models.GroceryItem.need == need).all()

def get_have(db: Session, have: str):
    return db.query(models.GroceryItem).filter(models.GroceryItem.have == have).all()

def create_grocery(item: GroceryItemCreate, db: Session):
    db_item = GroceryItem(
        name=item.name,
        quantity=item.quantity,
        unit=item.unit,
        category=item.category,
        have=False,
        need=True
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def create_pantry(item: PantryItemCreate, db: Session):
    db_item = GroceryItem(
        name=item.name,
        quantity=item.quantity,
        unit=item.unit,
        category=item.category,
        have=True,
        need=False
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_grocery(db: Session, item_id: int, item_data):
    existing_item = db.query(models.GroceryItem).filter(models.GroceryItem.id == item_id).first()

    if not existing_item:
        return None

    existing_item.name = item_data.name
    existing_item.quantity = item_data.quantity
    existing_item.unit = item_data.unit
    existing_item.category = item_data.category
    existing_item.have = item_data.have
    existing_item.need = item_data.need

    db.commit()
    db.refresh(existing_item)
    return existing_item

def delete_grocery(item_id: int, db: Session):
    item = get_item(item_id=item_id, db=db)
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
    return {"detail": "Item deleted"}

def patch_grocery(db: Session, item_id: int, item_data):
    existing_item = db.query(models.GroceryItem).filter(models.GroceryItem.id == item_id).first()

    if not existing_item:
        return None

    if item_data.name is not None:
        existing_item.name = item_data.name
    if item_data.quantity is not None:
        existing_item.quantity = item_data.quantity
    if item_data.unit is not None:
        existing_item.unit = item_data.unit
    if item_data.category is not None:
        existing_item.category = item_data.category
    if item_data.have is not None:
        existing_item.have = item_data.have
    if item_data.need is not None:
        existing_item.need = item_data.need

    db.commit()
    db.refresh(existing_item)
    return existing_item

# Recipes Crud

def get_recipe(item_id: int, db: Session):
    return db.query(models.Recipe).filter(models.Recipe.id == item_id).first()

def create_recipe(db: Session, recipe_data):
    db_recipe = models.Recipe(
        title=recipe_data.title,
        instructions=recipe_data.instructions,
        ingredients=recipe_data.ingredients,
        category=recipe_data.category
    )
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    return db_recipe

def get_recipes(db: Session, title=None, ingredient=None, category=None):
    query = db.query(models.Recipe)

    if title:
        query = query.filter(models.Recipe.title.ilike(f"%{title}%"))

    if ingredient is not None:
        query = query.filter(models.Recipe.ingredients.ilike(f"%{ingredient}%"))
        
    if category is not None:
        query = query.filter(models.Recipe.category == category)

    return query.all()

def patch_recipe(db: Session, item_id: int, item_data):
    existing_item = db.query(models.Recipe).filter(models.Recipe.id == item_id).first()

    if not existing_item:
        return None

    if item_data.title is not None:
        existing_item.title = item_data.title
    if item_data.ingredients is not None:
        existing_item.ingredients = item_data.ingredients
    if item_data.category is not None:
        existing_item.category = item_data.category

    db.commit()
    db.refresh(existing_item)
    return existing_item

def delete_recipe(item_id: int, db: Session):
    item = get_recipe(item_id=item_id, db=db)
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
    return {"detail": "Item deleted"}