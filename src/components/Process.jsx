import React from 'react'
import ganttImg from '../assets/gantt.png'

export default function Process({ onBack }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '1rem',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#222',
      }}
    >
      <button
        onClick={onBack}
        style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          zIndex: 10,
        }}
      >
        Volver
      </button>

      <div style={{ width: '100%', maxWidth: 900, padding: '0 1rem', boxSizing: 'border-box' }}>
        <img
          src={ganttImg}
          alt="Gantt FIFO"
          style={{
            display: 'block',
            margin: '0 auto',
            width: '100%',
            maxWidth: '100%',
            maxHeight: '80vh',
            height: 'auto',
            border: '1px solid #ddd',
            borderRadius: 6,
            background: '#fff',
          }}
        />
      </div>
    </div>
  )
}
