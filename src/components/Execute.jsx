// ...existing code...
import React from 'react'

export default function Execute({ onBack }) {
  return (
<div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '1rem',
      }}
    >
      <button onClick={onBack} style={{ alignSelf: 'flex-start' }}>Volver</button>

      <div
        style={{
          fontSize: 20,
          textAlign: 'center',
          whiteSpace: 'pre-line',
          marginTop: '1rem',
          maxWidth: 800,
        }}
      >
        {`Promedio de tiempo de espera de FIFO en Linux = 3 segundos

mientras que en el sistema operativo Microsoft Windows es de 5 segundos

por lo tanto Google nos contrata

y asi con el tiempo de respuesta en FIFO es 9,75 segundos y Microsoft Windows es 11,75 segundos`}
      </div>
    </div>
  )
}
// ...existing code...