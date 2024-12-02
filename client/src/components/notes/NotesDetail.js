import React, { useState, useEffect } from "react";
import { updateNote } from "../../services/noteService";

const NotesDetail = ({ note, onClose, refreshNotes }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(note?.content || "");
  const [editedTitle, setEditedTitle] = useState(note?.title || "");
  const [editedCategories, setEditedCategories] = useState(note?.categories.join(", ") || "");

  useEffect(() => {
    if (note) {
      setEditedTitle(note.title);
      setEditedContent(note.content);
      setEditedCategories(note.categories.join(", "));
    }
  }, [note]);

  const handleSave = () => {
    if (!note) return;
    updateNote(note._id, {
      title: editedTitle,
      content: editedContent,
      categories: editedCategories.split(",").map((cat) => cat.trim()),
    })
      .then(() => {
        refreshNotes();
        setEditMode(false);
        onClose();
      })
      .catch(console.error);
  };

  if (!note) return null; // Non mostrare nulla se non c'è una nota selezionata

  return (
    <div className="note-detail-container">
      {editMode ? (
        <div className="edit-note-card">
          <h2>Modifica Nota</h2>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="Modifica Titolo"
            required
          />
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            placeholder="Modifica Contenuto"
            required
          />
          <input
            type="text"
            value={editedCategories}
            onChange={(e) => setEditedCategories(e.target.value)}
            placeholder="Modifica Categorie (separate da virgola)"
            required
          />
          <div className="note-actions">
            <button className="save-note-button" onClick={handleSave}>
              Salva e Chiudi
            </button>
            <button className="note-button" onClick={() => setEditMode(false)}>
              Annulla
            </button>
          </div>
        </div>
      ) : (
        <div className="note-view-card">
          <h2>{note.title}</h2>
          <p>{note.content}</p>
          <p>
            <strong>Categorie:</strong> {note.categories.join(", ")}
          </p>
          <div className="note-actions">
            <button className="note-button" onClick={() => setEditMode(true)}>
              Modifica
            </button>
            <button className="note-button" onClick={onClose}>
              Chiudi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesDetail;
