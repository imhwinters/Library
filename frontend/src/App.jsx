import { useEffect, useState } from "react";
import BookSection from "./components/BookSection";
import BookPopup from "./components/BookPopup";

function App() {
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);

    function fetchBooks() {
        fetch("http://localhost:8000/api/books")
            .then((res) => res.json())
            .then((data) => setBooks(data))
            .catch((err) => console.error(err));
    }

    useEffect(() => {
        fetchBooks();
    }, []);

    async function handleSaveBook(updatedBook) {
        await fetch(
            `http://localhost:8000/api/books/${updatedBook.id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedBook),
            }
        );

        fetchBooks();
        setSelectedBook(null);
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
        </div>
    );
}

export default App;