import os
from dotenv import load_dotenv
from pinecone import Pinecone
from fastapi import UploadFile, File, APIRouter, Depends, HTTPException
from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.dependencies import authenicate_user
from app.database.db import get_db
from sqlalchemy.orm import Session
from app.services.embedding_service import embedding_model
from app.database.schema.document_schema import DocumentSchema
from app.database.schema.message_schema import MessageSchema
import cloudinary
import cloudinary.uploader
from app.config.app_config import getAppConfig
import uuid

load_dotenv()
router = APIRouter(prefix="/documents", dependencies=[Depends(authenicate_user)])

def get_cloudinary():
    config = getAppConfig()
    cloudinary.config(
        cloud_name=config.cloudinary_cloud_name,
        api_key=config.cloudinary_api_key,
        api_secret=config.cloudinary_api_secret,
    )

pc = Pinecone(
    api_key=os.getenv("PINECONE_API_KEY")
)
index = pc.Index("multi-pdf")

@router.post("")
async def upload_pdf(file: UploadFile = File(...), db: Session = Depends(get_db), user=Depends(authenicate_user)):
    user_id = user["id"]

    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    file_bytes = file.file.read()

    get_cloudinary()

    result = cloudinary.uploader.upload(
        file_bytes,
        resource_type="raw",
        folder="pdfs",
        public_id=file.filename,
    )

    reader = PdfReader(file.file)
    total_pages = len(reader.pages)

    document = DocumentSchema(
        user_id=user_id,
        file_name=file.filename,
        status="processing",
        url=result["secure_url"],
        total_pages=total_pages
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    document_id = str(document.id)

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    documents = []

    for page_number, page in enumerate(reader.pages, start=1):
        page_text = page.extract_text() or ""
        page_chunks = splitter.split_text(page_text)
        for chunk in page_chunks:
            documents.append({
                "text": chunk,
                "page": page_number
            })

    texts = [doc["text"] for doc in documents]
    embeddings = embedding_model.encode(texts)

    vectors = []
    for doc, embedding in zip(documents, embeddings):
        vectors.append({
            "id": str(uuid.uuid4()),
            "values": embedding.tolist(),
            "metadata": {
                "document_id": document_id,
                "user_id": user_id,
                "text": doc["text"],
                "page": doc["page"],
                "source": file.filename,
                "total_pages": total_pages
            }
        })

    index.upsert(vectors=vectors)
    document.status = "completed"
    db.commit()

    return {
        "message": "Document uploaded successfully",
        "filename": file.filename,
        "document_id": document_id,
        "user_id": user_id,
        "total_pages": total_pages,
        "chunks": len(documents),
    }

@router.get("")
async def list_documents(db: Session = Depends(get_db), user=Depends(authenicate_user)):
    """List all documents uploaded by the current user."""
    user_id = user["id"]
    documents = db.query(DocumentSchema).filter(DocumentSchema.user_id == user_id).all()

    return {
        "documents": [
            {
                "id": doc.id,
                "file_name": doc.file_name,
                "url": doc.url,
                "status": doc.status,
                "total_pages": doc.total_pages,
            }
            for doc in documents
        ]
    }

@router.delete("/{document_id}")
async def delete_document(document_id: int, db: Session = Depends(get_db), user=Depends(authenicate_user)):
    """Delete a document from database and remove vectors from Pinecone."""
    user_id = user["id"]

    # Verify the document belongs to the user
    document = db.query(DocumentSchema).filter(
        DocumentSchema.id == document_id,
        DocumentSchema.user_id == user_id
    ).first()

    if not document:
        raise HTTPException(status_code=404, detail="Document not found or unauthorized")

    # 1. Remove vectors from Pinecone
    try:
        index.delete(filter={"document_id": str(document_id)})
    except Exception as e:
        # We log this but still proceed with DB deletion to avoid orphaned records
        print(f"Error deleting Pinecone vectors: {e}")

    # 2. Delete associated messages from Database
    db.query(MessageSchema).filter(MessageSchema.document_id == document_id).delete()

    # 3. Delete document from Database
    db.delete(document)
    db.commit()

    return {"message": f"Document {document_id}, its messages, and its associated vectors have been deleted"}
