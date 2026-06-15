from sqlalchemy.orm import Session

from app.database.schema.message_schema import MessageSchema


def save_message(
    db: Session,
    document_id: int,
    user_id: int,
    role: str,
    content: str,
):
    message = MessageSchema(
        document_id=document_id,
        user_id=user_id,
        role=role,
        content=content,
    )

    db.add(message)
    db.commit()
    db.refresh(message)

    return message


def get_recent_messages(
    db: Session,
    document_id: int,
    limit: int = 10,
):
    messages = (
        db.query(MessageSchema)
        .filter(MessageSchema.document_id == document_id)
        .order_by(MessageSchema.created_at.desc())
        .limit(limit)
        .all()
    )

    return list(reversed(messages))

def build_chat_history(messages):
    history = []

    for msg in messages:
        history.append(
            f"{msg.role}: {msg.content}"
        )

    return "\n".join(history)