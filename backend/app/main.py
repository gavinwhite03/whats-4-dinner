from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, database
from .models import GroceryItem, GroceryItemCreate

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

@app.get("/")
def read_root():
    return {"message": "Grocery API running"}

@app.get("/groceries")
def get_groceries(db: Session = Depends(get_db)):
    return db.query(models.GroceryItem).all()

@app.post("/groceries")
def add_grocery(item: GroceryItemCreate, db: Session = Depends(get_db)):
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



@app.delete("/groceries/{item_id}")
def delete_grocery(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.GroceryItem).filter(models.GroceryItem.id == item_id).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
    return {"detail": "Item deleted"}
