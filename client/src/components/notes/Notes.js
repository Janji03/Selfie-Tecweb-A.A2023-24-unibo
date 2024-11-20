import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { createNote, getNotes } from "../../services/noteService";
import NotesView from "./NotesView";
import NotesDetail from "./NotesDetail";
import SortNotes from "./SortNotes";

const Notes = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const userID = localStorage.getItem("userID"); // Recupera userID
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null); // Nota attualmente selezionata
  const [error, setError] = useState(null);

  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    categories: [],
  });

  useEffect(() => {
    if (isAuthenticated) {
      getNotes(userID)
        .then((data) => setNotes(data))
        .catch((err) => setError(err.message));
    }
  }, [isAuthenticated, userID]);

  const handleCreateNote = (e) => {
    e.preventDefault();
    console.log('Chiamata a getNotes con userID:', userID);

    createNote({ ...newNote, userID })
      .then((createdNote) => {
        setNotes((prev) => [...prev, createdNote]);
        setNewNote({ title: "", content: "", categories: [] }); // Reset form
      })
      .catch((err) => setError(err.message));
  };

  if (!isAuthenticated) return <p>Effettua il login per gestire le tue note.</p>;
  if (error) return <p>Errore: {error}</p>;

  return (
    <div>
      <h1>Gestione Note</h1>
      <form onSubmit={handleCreateNote}>
        <input
          type="text"
          placeholder="Titolo"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Contenuto"
          value={newNote.content}
          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Categorie (separate da virgola)"
          value={newNote.categories.join(", ")}
          onChange={(e) =>
            setNewNote({ ...newNote, categories: e.target.value.split(",") })
          }
        />
        <button type="submit">Crea Nota</button>
      </form>
      <NotesDetail
        note={selectedNote}
        onClose={() => setSelectedNote(null)}
        refreshNotes={() => getNotes(userID).then(setNotes)}
      />
      <SortNotes notes={notes} setNotes={setNotes} />
      <NotesView
        notes={notes}
        setSelectedNote={setSelectedNote}
        refreshNotes={() => getNotes(userID).then(setNotes)}
      />
    </div>
  );
};

export default Notes;
