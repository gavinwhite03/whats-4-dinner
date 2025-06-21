from sqlalchemy.orm import Session
from . import models
from fastapi import FastAPI, Depends, HTTPException
from . import models, database
from .models import GroceryItem, GroceryItemCreate

def read_root():
    return {"message": "Grocery API running"}

def get_groceries(db: Session):
    return db.query(models.GroceryItem).all()

def get_item(item_id: int, db: Session):
    return db.query(models.GroceryItem).filter(models.GroceryItem.id == item_id).first()

def get_needs(db: Session, need: str):
    return db.query(models.GroceryItem).filter(models.GroceryItem.need == need).all()

def create_grocery(item: GroceryItemCreate, db: Session):
    db_item = GroceryItem(
        name=item.name,
        quantity=item.quantity,
        unit=item.unit,
        have=item.have,
        need=item.need
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
    if item_data.have is not None:
        existing_item.have = item_data.have
    if item_data.need is not None:
        existing_item.need = item_data.need

    db.commit()
    db.refresh(existing_item)
    return existing_item