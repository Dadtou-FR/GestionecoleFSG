import React, { useState } from 'react';
import CoursList from './CoursList';
import CoursForm from './CoursForm';

function CoursPage() {
  const [refresh, setRefresh] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleSuccess = () => {
    setRefresh(!refresh);
    setEditId(null);
  };

  return (
    <div>
      <h1>Gestion des cours</h1>
      <CoursForm id={editId} onSuccess={handleSuccess} />
      <CoursList key={refresh} />
    </div>
  );
}

export default CoursPage; 