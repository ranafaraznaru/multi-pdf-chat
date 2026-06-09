import os
import uuid
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File
from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
from langchain_core.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.embeddings import HuggingFaceEmbeddings
from pinecone import Pinecone
from pydantic import BaseModel

class QueryRequest(BaseModel):
    question: str
    document_id: str



app = FastAPI()
load_dotenv()



GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
pc = Pinecone(
    api_key=os.getenv("PINECONE_API_KEY")
)

index = pc.Index("multi-pdf")

splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200
)
model = SentenceTransformer("all-MiniLM-L6-v2")
embedding_model = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2"
)

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=GOOGLE_API_KEY
)

prompt = PromptTemplate(
    template= """
    you are a helpful assistant.
    Answer ONLY from the provided transcript context.
    If the context is insufficient, just say you dont know.

    {context}
    Question: {question}
    """,
    input_variables=["context", "question"]
)


@app.post("/upload")
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

@app.post("/query")
async def query(request: QueryRequest):
    print('request',request)
    question = request.question
    sources = []

    # 1. convert question to vector
    query_vector = model.encode(question).tolist()

    # 2. search Pinecone
    results = index.query(
        vector=query_vector,
        top_k=4,
        include_metadata=True,
        filter={
        "document_id": request.document_id
    }
    )
    print('results',results)

    # 3. extract text chunks
    context_chunks = []

    for match in results["matches"]:
        context_chunks.append(match["metadata"]["text"])
        sources.append({
        "score": match["score"],
        "text": match["metadata"]["text"][:300]
    })

    context = "\n\n".join(context_chunks)
    print('context',context)

    # 4. build prompt
    final_prompt = prompt.invoke({
        "context": context,
        "question": question
    })
    print('final_prompt',final_prompt)

    # 5. get answer from LLM
    answer = llm.invoke(final_prompt)
    print('answer',answer)

    return {
        "question": question,
        "answer": answer.content,
        "sources": sources
    }




# question = "what is open route?"
# retrieved_docs = retriever.invoke(question)
# context_text = "\n\n".join(doc.page_content for doc in retrieved_docs)
# # print('context_text',context_text)

# final_prompt = prompt.invoke({"context":context_text, "question":question})
# print('final_prompt',final_prompt)

# #Step 4
# #Generation
# answer = llm.invoke(final_prompt)
# print('answer',answer)
