from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from ..db import Base
from datetime import datetime, timezone


class DocumentSchema(Base):
    __tablename__ = 'documents'
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    file_name = Column(String, nullable=False)
    url = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.now(timezone.utc))
    status = Column(String, default="processing")  # processing | completed | failed
    total_pages = Column(Integer, nullable=True)
