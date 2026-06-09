from dotenv import load_dotenv
from fastapi import FastAPI
from app.routing import upload, query , auth



app = FastAPI()
load_dotenv()

# Include all routes here
app.include_router(auth.router ,prefix="/api/v1")
app.include_router(upload.router ,prefix="/api/v1")
app.include_router(query.router ,prefix="/api/v1")
