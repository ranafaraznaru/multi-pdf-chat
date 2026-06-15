from dotenv import load_dotenv
from fastapi import FastAPI
from app.routing import auth,documents , chat

app = FastAPI()
load_dotenv()

# Include all routes here
app.include_router(auth.router ,prefix="/api/v1")
app.include_router(documents.router ,prefix="/api/v1")
app.include_router(chat.router ,prefix="/api/v1")
