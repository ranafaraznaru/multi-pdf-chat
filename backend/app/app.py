from dotenv import load_dotenv
from fastapi import FastAPI
from app.routing import auth,documents , chat
from fastapi.middleware.cors import CORSMiddleware
from app.database.db import Base, engine

app = FastAPI()
load_dotenv()

# Automatically create tables if they don't exist
Base.metadata.create_all(bind=engine)

origins = [
    "http://localhost:3000",
    "https://multi-pdf-chat-swart.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routes here
app.include_router(auth.router ,prefix="/api/v1")
app.include_router(documents.router ,prefix="/api/v1")
app.include_router(chat.router ,prefix="/api/v1")