import { useState, useEffect, useRef } from "react";

function BookCard({ book, onClick }) {
    const cardRef = useRef(null);

    return (
        <div ref={cardRef} className="book-card-container" onClick={onClick}>
            <img
                className="book-cover"
                src={book.cover_url}
                alt={book.title}
                height={300}
                onClick={onClick}
            />
        </div>
    );
}

export default BookCard;