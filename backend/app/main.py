from fastapi import FastAPI
from . import models, database

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Grocery API running"}
