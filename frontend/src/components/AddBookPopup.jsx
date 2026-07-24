import { useEffect, useRef, useState } from "react";
import "./BookPopup.css";

function AddBookPopup({ isOpen, onClose, onAdd }) {
    const [isbn, setIsbn] = useState("");
    const [status, setStatus] = useState("want_to_read");

    const inputRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        setIsbn("");
        setStatus("want_to_read");

        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    }, [isOpen]);

    if (!isOpen) return null;

    function handleSubmit(e) {
        e.preventDefault();

        if (isbn.trim() === "") return;

        onAdd({
            isbn: isbn.trim(),
            status,
        });
    }

    return (
        <div
            className="popup-overlay"
            onClick={onClose}
        >
            <div
                className="popup add-book-popup"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="close-button"
                    onClick={onClose}
                >
                    ✕
                </button>

                <form
                    className="popup-content"
                    onSubmit={handleSubmit}
                >
                    <div className="popup-fields">

                        <h2>Add Book</h2>

                        <label>
                            ISBN
                            <input
                                ref={inputRef}
                                type="text"
                                value={isbn}
                                placeholder="Scan or type an ISBN..."
                                onChange={(e) =>
                                    setIsbn(e.target.value)
                                }
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

                        <div className="popup-buttons">
                            <button
                                type="button"
                                onClick={onClose}
                            >
                                Cancel
                            </button>

                            <button type="submit">
                                Add Book
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddBookPopup;
