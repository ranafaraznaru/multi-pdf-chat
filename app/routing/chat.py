import os
from fastapi import APIRouter,Depends
from pinecone import Pinecone
from langchain_core.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from app.models.query import QueryRequest
from app.dependencies import authenicate_user
from app.database.db import get_db
from sqlalchemy.orm import Session
from app.services.chat_service import save_message,get_recent_messages,build_chat_history
from app.services.embedding_service import embedding_model
from app.database.schema.message_schema import MessageSchema

router = APIRouter(prefix="/chat" , dependencies=[Depends(authenicate_user)])

pc = Pinecone(
    api_key=os.getenv("PINECONE_API_KEY")
)
index = pc.Index("multi-pdf")

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")


llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=GOOGLE_API_KEY
)


# prompt = PromptTemplate(
#     template= """
#     you are a helpful assistant.
#     Answer ONLY from the provided transcript context.
#     If the context is insufficient, just say you dont know.

#     {context}
#     Question: {question}
#     """,
#     input_variables=["context", "question"]
# )  
prompt = PromptTemplate(
    template="""
You are a helpful assistant.

Conversation History:
{history}

Document Context:
{context}

Question:
{question}

Answer using the document context.

If the answer is not available in the document,
say you don't know.
""",
    input_variables=[
        "history",
        "context",
        "question",
    ]
)  


@router.post("/{doc_id}/query")
async def query(doc_id: int, request: QueryRequest, db: Session = Depends(get_db), user=Depends(authenicate_user)):
    question = request.question
    sources = []
    user_id = user["id"]

    save_message(
    db=db,
    document_id=doc_id,
    user_id=user["id"],
    role="user",
    content=request.question,
    )

    # 1. convert question to vector
    query_vector = embedding_model.encode(question).tolist()

    # 2. search Pinecone
    results = index.query(
        vector=query_vector,
        top_k=4,
        include_metadata=True,
        filter={
        "document_id": str(doc_id),
        "user_id":user_id,
    }
    )
    # 3. extract text chunks
    context_chunks = []

    for match in results["matches"]:
        context_chunks.append(match["metadata"]["text"])
        sources.append({
        "score": match["score"],
        "page": match["metadata"].get("page"),
        "text": match["metadata"]["text"][:300]
    })
    

    context = "\n\n".join(context_chunks)

    # 4. build prompt
    # final_prompt = prompt.invoke({
    #     "context": context,
    #     "question": question
    # })
    history_messages = get_recent_messages(
    db=db,
    document_id=doc_id,
    limit=10
    )
    history = build_chat_history(history_messages)
    final_prompt = prompt.invoke({
    "history": history,
    "context": context,
    "question": question
    })

    # 5. get answer from LLM
    answer = llm.invoke(final_prompt)
    save_message(
    db=db,
    document_id=doc_id,
    user_id=user["id"],
    role="assistant",
    content=answer.content,
    )

    return {
        "question": question,
        "answer": answer.content,
        "sources": sources
    }


@router.get("/{doc_id}/history")
async def get_chat_history(doc_id: int, db: Session = Depends(get_db), user=Depends(authenicate_user)):
    """Retrieve the chat history for a specific document."""
    user_id = user["id"]

    # Fetch messages and verify the document belongs to the user
    messages = (
        db.query(MessageSchema)
        .filter(MessageSchema.document_id == doc_id, MessageSchema.user_id == user_id)
        .order_by(MessageSchema.created_at.asc())
        .all()
    )

    return {
        "document_id": doc_id,
        "history": [
            {
                "role": msg.role,
                "content": msg.content,
                "created_at": msg.created_at
            }
            for msg in messages
        ]
    }