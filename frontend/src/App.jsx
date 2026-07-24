import { useEffect, useState } from "react";
import BookSection from "./components/BookSection";
import BookPopup from "./components/BookPopup";
import AddBookPopup from "./components/AddBookPopup";

// The IP address used here is TEMPORARY! REPLACE WHEN CADDY IS UP AND RUNNING!

function App() {
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [showAddPopup, setShowAddPopup] = useState(false);

    async function fetchBooks() {
        const res = await fetch("http://192.168.86.21:8000/api/books");
        const data = await res.json();
        setBooks(data);
    }

    useEffect(() => {
        fetchBooks();
    }, []);

    async function handleSaveBook(updatedBook) {
        await fetch(
            `http://192.168.86.21:8000/api/books/${updatedBook.id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedBook),
            }
        );

        await fetchBooks();
        setSelectedBook(null);
    }

    async function handleAddBook(bookData) {
        const response = await fetch(
            "http://192.168.86.21:8000/api/scan",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bookData),
            }
        );

        if (!response.ok) {
            alert("Unable to add book.");
            return;
        }

        await fetchBooks();
        setShowAddPopup(false);
    }

    const reading = books.filter(
        (book) => book.status === "reading"
    );

    const wantToRead = books.filter(
        (book) => book.status === "want_to_read"
    );

    const finished = books.filter(
        (book) => book.status === "finished"
    );

    return (
        <div className="app">
            <h1>Isaac's Library</h1>

            <button
                className="add-book-button"
                onClick={() => setShowAddPopup(true)}
            >
                + Add Book
            </button>

            <BookSection
                title="Currently Reading"
                books={reading}
                setSelectedBook={setSelectedBook}
            />

            <BookSection
                title="Want to Read"
                books={wantToRead}
                setSelectedBook={setSelectedBook}
            />

            <BookSection
                title="Finished"
                books={finished}
                setSelectedBook={setSelectedBook}
            />

            <BookPopup
                book={selectedBook}
                onClose={() => setSelectedBook(null)}
                onSave={handleSaveBook}
            />

            <AddBookPopup
                isOpen={showAddPopup}
                onClose={() => setShowAddPopup(false)}
                onAdd={handleAddBook}
            />
        </div>
    );
}

export default App;
