from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String

from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True)
    isbn = Column(String, unique=True)
    title = Column(String)
    author = Column(String)
    cover_url = Column(String)
    status = Column(String)
    notes = Column(String)
