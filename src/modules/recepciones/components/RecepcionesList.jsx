import React from 'react';
import CardRecepcion from './CardRecepcion';

const RecepcionesList = ({ recepciones = [], onCancel }) => {
  if (!recepciones || recepciones.length === 0) {
    return <div style={{padding:20}}>No hay recepciones registradas.</div>;
  }

  return (
    <div style={{display:'grid', gridTemplateColumns: '1fr', gap:12}}>
      {recepciones.map((r) => (
        <CardRecepcion key={r.id} recepcion={r} onCancel={onCancel} />
      ))}
    </div>
  );
};

export default RecepcionesList;
