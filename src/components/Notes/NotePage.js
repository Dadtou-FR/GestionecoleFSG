import React, { useState } from 'react';
import NoteList from './NoteList';
import NoteForm from './NoteForm';

function NotePage() {
  const [refresh, setRefresh] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleSuccess = () => {
    setRefresh(!refresh);
    setEditId(null);
  };

  return (
    <div>
      <h1>Gestion des notes</h1>
      <NoteForm id={editId} onSuccess={handleSuccess} />
      <NoteList key={refresh} />
    </div>
  );
}

export default NotePage; 