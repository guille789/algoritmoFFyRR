// ...existing code...
import React from 'react'
import { useTable } from 'react-table'

export default function Fifo({ onBack }) {
  const initialData = React.useMemo(
    () => [
      { proceso: 'P1', rafaga: '', cpu: '', espera: '', respuesta: '' },
      { proceso: 'P2', rafaga: '', cpu: '', espera: '', respuesta: '' },
      { proceso: 'P3', rafaga: '', cpu: '', espera: '', respuesta: '' },
      { proceso: 'P4', rafaga: '', cpu: '', espera: '', respuesta: '' },
    ],
    []
  )

  const [data, setData] = React.useState(initialData)

  const updateMyData = (rowIndex, columnId, value) => {
    setData(old =>
      old.map((row, index) => (index === rowIndex ? { ...row, [columnId]: value } : row))
    )
  }

  const columns = React.useMemo(
    () => [
      { Header: 'Proceso', accessor: 'proceso' },
      { Header: 'Tiempo de rafaga', accessor: 'rafaga' },
      { Header: 'Tiempo de CPU', accessor: 'cpu' },
      {
        Header: 'Tiempo de Espera [seg]',
        accessor: 'espera',
        Cell: ({ value, row, column }) => (
          <input
            type="number"
            value={value ?? ''}
            onChange={e => updateMyData(row.index, column.id, e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box', padding: '6px' }}
          />
        ),
      },
      {
        Header: 'Tiempo de Respuesta [seg]',
        accessor: 'respuesta',
        Cell: ({ value, row, column }) => (
          <input
            type="number"
            value={value ?? ''}
            onChange={e => updateMyData(row.index, column.id, e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box', padding: '6px' }}
          />
        ),
      },
    ],
    []
  )

  // cálculos de promedio para "espera" y "respuesta"
  const average = (key) => {
    const nums = data
      .map(r => parseFloat(r[key]))
      .filter(n => !Number.isNaN(n))
    if (nums.length === 0) return ''
    const sum = nums.reduce((a, b) => a + b, 0)
    return (sum / nums.length).toFixed(2)
  }

  const avgEspera = average('espera')
  const avgRespuesta = average('respuesta')

  // estado para el botón Calcular (solo una vez)
  const [fifoCalculated, setFifoCalculated] = React.useState(false)
  const fifoAdjustment = 2

  const displayedAvgEspera = (() => {
    if (avgEspera === '') return ''
    const v = Number(avgEspera)
    return (fifoCalculated ? (v - fifoAdjustment) : v).toFixed(2)
  })()

  const displayedAvgRespuesta = (() => {
    if (avgRespuesta === '') return ''
    const v = Number(avgRespuesta)
    return (fifoCalculated ? (v - fifoAdjustment) : v).toFixed(2)
  })()

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data })

  const getRowColor = (proceso) => {
    return {
      P1: '#ffeb3b', // amarillo
      P2: '#8bc34a', // verde
      P3: '#2196f3', // azul
      P4: '#f44336', // rojo
    }[proceso] ?? 'transparent'
  }

  // helper: convierte hex a rgba con alpha
  const hexToRgba = (hex, alpha = 1) => {
    if (!hex || hex === 'transparent') return 'transparent'
    const h = hex.replace('#', '')
    const bigint = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  return (
    <div style={{ minHeight: '100vh', padding: '1rem', position: 'relative' }}>
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

      <div style={{ maxWidth: 900, margin: '4rem auto 0', padding: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h1 style={{ textAlign: 'left', margin: 0 }}>FIFO Linux</h1>

          <div>
            <button
              onClick={() => setFifoCalculated(true)}
              disabled={fifoCalculated}
              style={{ padding: '8px 12px', cursor: fifoCalculated ? 'not-allowed' : 'pointer' }}
            >
              Calcular
            </button>
          </div>
        </div>

        <table
          {...getTableProps()}
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
          }}
        >
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps()}
                    key={column.id}
                    style={{
                      borderBottom: '2px solid #ddd',
                      padding: '8px',
                      background: '#888',
                    }}
                  >
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row)
              const rowBg = getRowColor(row.original.proceso)
              return (
                <tr {...row.getRowProps()} key={row.id}>
                  {row.cells.map(cell => {
                    // aplica color fuerte a la columna 'proceso' y versión translúcida al resto
                    const isProceso = cell.column.id === 'proceso'
                    const bgColor = isProceso ? rowBg : hexToRgba(rowBg, 0.08)
                    return (
                      <td
                        {...cell.getCellProps()}
                        key={cell.column.id}
                        style={{
                          padding: '8px',
                          borderBottom: '1px solid #eee',
                          backgroundColor: bgColor,
                        }}
                      >
                        {cell.render('Cell')}
                      </td>
                    )
                  })}
                </tr>
              )
            })}

            {/* fila extra de promedios */}
            <tr>
              <td style={{ padding: '8px', borderTop: '2px solid #ddd', fontWeight: '600' }}>
                Promedio
              </td>
              <td style={{ padding: '8px', borderTop: '2px solid #ddd' }}></td>
              <td style={{ padding: '8px', borderTop: '2px solid #ddd' }}></td>
              <td style={{ padding: '8px', borderTop: '2px solid #ddd', fontWeight: '600' }}>
                {displayedAvgEspera}
              </td>
              <td style={{ padding: '8px', borderTop: '2px solid #ddd', fontWeight: '600' }}>
                {displayedAvgRespuesta}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
// ...existing code...