import os
from fastapi import APIRouter
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone
from langchain_core.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI

router = APIRouter(prefix="/query")


model = SentenceTransformer("all-MiniLM-L6-v2")

pc = Pinecone(
    api_key=os.getenv("PINECONE_API_KEY")
)
index = pc.Index("multi-pdf")

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")



llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=GOOGLE_API_KEY
)



class QueryRequest(BaseModel):
    question: str
    document_id: str


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