import { useEffect, useState } from "react";
import "./BookPopup.css";

function BookPopup({ book, onClose, onSave }) {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [status, setStatus] = useState("want_to_read");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        if (!book) return;

        setTitle(book.title);
        setAuthor(book.author);
        setStatus(book.status);
        setNotes(book.notes);
    }, [book]);

    if (!book) return null;

    function handleSave() {
        onSave({
            ...book,
            title,
            author,
            status,
            notes,
        });
    }

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div
                className="popup"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="close-button"
                    onClick={onClose}
                >
                    ✕
                </button>

                <div className="popup-content">
                    <img
                        className="popup-cover"
                        src={book.cover_url}
                        alt={title}
                    />

                    <div className="popup-fields">
                        <label>
                            Title
                            <input
                                value={title}
                                onChange={(e) =>
                                    setTitle(e.target.value)
                                }
                            />
                        </label>

                        <label>
                            Author
                            <input
                                value={author}
                                onChange={(e) =>
                                    setAuthor(e.target.value)
                                }
                            />
                        </label>

                        <label>
                            ISBN
                            <input
                                value={book.isbn}
                                disabled
                            />
                        </label>

                        <label>
                            Status
                            <select
                                value={status}
                                onChange={(e) =>
                                    setStatus(e.target.value)
                                }
                            >
                                <option value="want_to_read">
                                    Want to Read
                                </option>

                                <option value="reading">
                                    Currently Reading
                                </option>

                                <option value="finished">
                                    Finished
                                </option>
                            </select>
                        </label>

                        <label>
                            Notes
                            <textarea
                                rows={10}
                                value={notes}
                                onChange={(e) =>
                                    setNotes(e.target.value)
                                }
                            />
                        </label>

                        <div className="popup-buttons">
                            <button onClick={onClose}>
                                Cancel
                            </button>

                            <button onClick={handleSave}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookPopup;
