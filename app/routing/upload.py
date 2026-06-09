import os
import uuid
from dotenv import load_dotenv
from pinecone import Pinecone
from fastapi import UploadFile, File,APIRouter
from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer

load_dotenv()
router = APIRouter(prefix="/upload")


model = SentenceTransformer("all-MiniLM-L6-v2")


splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200
)

pc = Pinecone(
    api_key=os.getenv("PINECONE_API_KEY")
)
index = pc.Index("multi-pdf")



@router.post("")
async def upload_pdf(file: UploadFile = File(...)):
    
    reader = PdfReader(file.file)
    document_id = str(uuid.uuid4())

    text = ""

    # for page in reader.pages:
    for page_number, page in enumerate(reader.pages, start=1):
        text += page.extract_text() or ""
        # print("Pages:", len(reader.pages))
        # print("Characters:", len(text))

    chunks = splitter.split_text(text)
    embeddings = model.encode(chunks)
    vectors = []

    for chunk, embedding in zip(chunks, embeddings):
        vectors.append(
            {
                "id": str(uuid.uuid4()),
                "values": embedding.tolist(),
                "metadata": {
                    "document_id": document_id,
                    "text": chunk,
                    "source": file.filename,
                    "page": page_number,
                }
            }
        )

    index.upsert(vectors=vectors)

    stats = index.describe_index_stats()

    return {
        "filename": file.filename,
        "document_id": document_id,
        "chunks": len(chunks),
        "index_stats": stats
    }