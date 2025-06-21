from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from . import models, database, crud
from .models import GroceryItem, GroceryItemCreate, GroceryItemResponse, GroceryItemUpdate, PantryItemCreate
from typing import List, Optional


models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# Dependency - get DB session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Routes

@app.get("/items")
def get_groceries(
    db: Session = Depends(get_db),
    name: Optional[str] = Query(None),
    need: Optional[bool] = Query(None),
    have: Optional[bool] = Query(None),
    category: Optional[str] = Query(None)
):
    return crud.get_groceries(db, name=name, need=need, have=have, category=category)

@app.get("/items/inventory")
def get_have(db: Session = Depends(get_db)):
    return crud.get_have(db, True)

@app.get("/items/shopping")
def get_needs(db: Session = Depends(get_db)):
    return crud.get_needs(db, False)

@app.put("/items/{item_id}", response_model=GroceryItemResponse)
def update_grocery(item_id: int, item: GroceryItemCreate, db: Session = Depends(get_db)):
    updated_item = crud.update_grocery(db, item_id, item)
    if not updated_item:
        raise HTTPException(status_code=404, detail="Item not found")
    return updated_item
    
@app.post("/items/shopping")
def add_grocery(item: GroceryItemCreate, db: Session = Depends(get_db)):
    return crud.create_grocery(item, db)

@app.post("/items/inventory")
def add_pantry(item: PantryItemCreate, db: Session = Depends(get_db)):
    return crud.create_pantry(item, db)

@app.delete("/items/{item_id}")
def delete_grocery(item_id: int, db: Session = Depends(get_db)):
    success = crud.delete_grocery(db, item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"detail": "Item deleted"}

@app.patch("/items/{item_id}", response_model=GroceryItemResponse)
def patch_grocery(item_id: int, item: GroceryItemUpdate, db: Session = Depends(get_db)):
    updated_item = crud.patch_grocery(db, item_id, item)
    if not updated_item:
        raise HTTPException(status_code=404, detail="Item not found")
    return updated_item