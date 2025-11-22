import React from 'react';

const CardRecepcion = ({ recepcion, onCancel }) => {
  const {
    id,
    compra_id,
    notas,
    recibido_por,
    sucursal_id,
    fecha_creacion,
    estatus
  } = recepcion || {};

  return (
    <div className="card-recepcion" style={{border:'1px solid #e0e0e0', padding:12, borderRadius:6, marginBottom:12}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <div><strong>ID:</strong> {id}</div>
          <div><strong>Compra:</strong> {compra_id}</div>
          <div><strong>Recibido por:</strong> {recibido_por}</div>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:12, color:'#666'}}>{fecha_creacion || recepcion.created_at}</div>
          <div style={{marginTop:8}}>
            <button onClick={() => onCancel && onCancel(id)} style={{background:'#e53935', color:'#fff', border:'none', padding:'6px 10px', borderRadius:4, cursor:'pointer'}}>Cancelar</button>
          </div>
        </div>
      </div>

      {notas && (
        <div style={{marginTop:10}}>
          <strong>Notas:</strong>
          <div style={{color:'#444'}}>{notas}</div>
        </div>
      )}

      {estatus && (
        <div style={{marginTop:8, fontSize:13}}>
          <strong>Estatus:</strong> {estatus}
        </div>
      )}
    </div>
  );
};

export default CardRecepcion;
