import React, { useState } from 'react';
import EnseignantList from './EnseignantList';
import EnseignantForm from './EnseignantForm';

function EnseignantPage() {
  const [refresh, setRefresh] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleSuccess = () => {
    setRefresh(!refresh);
    setEditId(null);
  };

  return (
    <div>
      <h1>Gestion des enseignants</h1>
      <EnseignantForm id={editId} onSuccess={handleSuccess} />
      <EnseignantList key={refresh} />
    </div>
  );
}

export default EnseignantPage; 