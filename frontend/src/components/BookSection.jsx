import { useRef, useState, useEffect, useCallback } from "react";
import BookCard from "./BookCard";

const VISIBLE_COUNT = 5;

function BookSection({ title, books, setSelectedBook }) {
    const trackRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleWheel = useCallback(
        (e) => {
            if (books.length <= VISIBLE_COUNT) return;

            e.preventDefault();

            const dir = e.deltaY > 0 ? 1 : -1;

            setActiveIndex((prev) =>
                Math.max(0, Math.min(books.length - 1, prev + dir))
            );
        },
        [books.length]
    );

    useEffect(() => {
        const el = trackRef.current;

        if (!el) return;

        el.addEventListener("wheel", handleWheel, {
            passive: false,
        });

        return () =>
            el.removeEventListener("wheel", handleWheel);
    }, [handleWheel]);

    const half = Math.floor(VISIBLE_COUNT / 2);

    const startIndex = Math.max(
        0,
        Math.min(
            activeIndex - half,
            books.length - VISIBLE_COUNT
        )
    );

    const visibleBooks = books.slice(
        startIndex,
        startIndex + VISIBLE_COUNT
    );

    const centerSlot = activeIndex - startIndex;

    const getStyle = (slotIndex) => {
        if (books.length <= VISIBLE_COUNT) {
            return {
                transition:
                    "all 0.35s cubic-bezier(.4,0,.2,1)",
            };
        }

        const distFromCenter = Math.abs(
            slotIndex - centerSlot
        );

        const scale =
            distFromCenter === 0 ? 1 : 0.85;

        const zIndex =
            VISIBLE_COUNT - distFromCenter;

        return {
            transform: `scale(${scale})`,
            zIndex,
            transition:
                "all 0.35s cubic-bezier(.4,0,.2,1)",
        };
    };

    return (
        <section className="book-section">
            <h2 className="book-section__title">
                {title}
            </h2>

            <div
                className="bookshelf-wrapper"
                ref={trackRef}
            >
                {books.length === 0 ? (
                    <p className="book-section__empty">
                        No books :(
                    </p>
                ) : (
                    <>
                        <div className="bookshelf__track">
                            {visibleBooks.map(
                                (book, slotIndex) => (
                                    <div
                                        key={book.id}
                                        className="bookshelf__slot"
                                        style={getStyle(
                                            slotIndex
                                        )}
                                        onClick={() =>
                                            setActiveIndex(
                                                startIndex +
                                                    slotIndex
                                            )
                                        }
                                    >
                                        <BookCard
                                            book={book}
                                            onClick={() =>
                                                setSelectedBook(
                                                    book
                                                )
                                            }
                                        />
                                    </div>
                                )
                            )}
                        </div>

                        {books.length >
                            VISIBLE_COUNT && (
                            <div className="bookshelf__dots">
                                {books.map((_, i) => (
                                    <button
                                        key={i}
                                        className={`bookshelf__dot${
                                            i ===
                                            activeIndex
                                                ? " bookshelf__dot--active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            setActiveIndex(
                                                i
                                            )
                                        }
                                        aria-label={`Go to book ${
                                            i + 1
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}

export default BookSection;
