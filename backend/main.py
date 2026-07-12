from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

from models import Base, Book
from database import engine, SessionLocal

Base.metadata.create_all(bind=engine)

app = FastAPI()

class ScanRequest(BaseModel):
    isbn: str
    status: str

class BookUpdate(BaseModel):
    title: str
    author: str
    status: str
    notes: str

@app.post("/api/scan")
def scan_book(data: ScanRequest):
    url = (
        f"https://openlibrary.org/"
        f"api/books?bibkeys=ISBN:{data.isbn}"
        f"&format=json&jscmd=data"
    )

    print(f"Fetching {url}")

    response = requests.get(
        url,
        timeout=10,
    )
    print (response.status_code)

    book_data=response.json()

    book_info = next(iter(book_data.values()))

    title = book_info.get("title", "Unknown Title")

    authors = book_info.get("authors", [])
    author = authors[0]["name"] if authors else "Unknown Author"

    cover = book_info.get("cover", {})
    cover_url = cover.get("medium", "")

    db = SessionLocal()

    book = Book(
        isbn = data.isbn,
        title = title,
        author = author,
        cover_url = cover_url,
        status = data.status,
        notes=""
    )

    db.add(book)
    db.commit()
    db.refresh(book)

    return {
        "status": "added",
        "title": title
    }

    return book_data

@app.get("/api/books")
def get_books():
    db = SessionLocal()
    books = db.query(Book).all()
    return books

@app.put("/api/books/{book_id}")
def update_book(book_id: int, data: BookUpdate):
    print(data)
    db = SessionLocal()

    book = db.query(Book).filter(Book.id == book_id).first()

    if not book:
        return {"error": "Book not found"}

    book.title = data.title
    book.author = data.author
    book.status = data.status
    book.notes = data.notes

    db.commit()
    db.refresh(book)

    return book

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)