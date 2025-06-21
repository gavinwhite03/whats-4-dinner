from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, database, crud
from .models import GroceryItem, GroceryItemCreate, GroceryItemResponse, GroceryItemUpdate

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

@app.get("/groceries")
def get_groceries(db: Session = Depends(get_db)):
    return crud.get_groceries(db)

@app.get("/groceries/true")
def get_needs(db: Session = Depends(get_db)):
    return crud.get_needs(db, True)

@app.get("/groceries/false")
def get_needs(db: Session = Depends(get_db)):
    return crud.get_needs(db, False)

@app.put("/groceries/{item_id}", response_model=GroceryItemResponse)
def update_grocery(item_id: int, item: GroceryItemCreate, db: Session = Depends(get_db)):
    updated_item = crud.update_grocery(db, item_id, item)
    if not updated_item:
        raise HTTPException(status_code=404, detail="Item not found")
    return updated_item
    
@app.post("/groceries")
def add_grocery(item: GroceryItemCreate, db: Session = Depends(get_db)):
    return crud.create_grocery(item, db)

@app.delete("/groceries/{item_id}")
def delete_grocery(item_id: int, db: Session = Depends(get_db)):
    success = crud.delete_grocery(db, item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"detail": "Item deleted"}

@app.patch("/groceries/{item_id}", response_model=GroceryItemResponse)
def patch_grocery(item_id: int, item: GroceryItemUpdate, db: Session = Depends(get_db)):
    updated_item = crud.patch_grocery(db, item_id, item)
    if not updated_item:
        raise HTTPException(status_code=404, detail="Item not found")
    return updated_item