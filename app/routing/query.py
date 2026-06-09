import os
from fastapi import APIRouter,Depends
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone
from langchain_core.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from app.models.query import QueryRequest
from app.dependencies import authenicate_user


router = APIRouter(prefix="/query" , dependencies=[Depends(authenicate_user)])



pc = Pinecone(
    api_key=os.getenv("PINECONE_API_KEY")
)
index = pc.Index("multi-pdf")

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")



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


@router.post("")
async def query(request: QueryRequest):
    model = SentenceTransformer("all-MiniLM-L6-v2")
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
    # 3. extract text chunks
    context_chunks = []

    for match in results["matches"]:
        context_chunks.append(match["metadata"]["text"])
        sources.append({
        "score": match["score"],
        "text": match["metadata"]["text"][:300]
    })

    context = "\n\n".join(context_chunks)

    # 4. build prompt
    final_prompt = prompt.invoke({
        "context": context,
        "question": question
    })

    # 5. get answer from LLM
    answer = llm.invoke(final_prompt)

    return {
        "question": question,
        "answer": answer.content,
        "sources": sources
    }