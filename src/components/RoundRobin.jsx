import React from 'react'
import { useTable } from 'react-table'
import ganttImg from '../assets/ganttRR.jpeg'

export default function RoundRobin({ onBack }) {
  const initialData = React.useMemo(
    () => [
      { proceso: 'Power Point', rafaga: '', llegada: '' },
      { proceso: 'Excel', rafaga: '', llegada: '' },
      { proceso: 'Word', rafaga: '', llegada: '' },
      { proceso: 'Access', rafaga: '', llegada: '' },
      { proceso: 'Publisher', rafaga: '', llegada: '' },
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
      {
        Header: 'Rafaga CPU [seg]',
        accessor: 'rafaga',
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
        Header: 'Tiempo de llegada [seg]',
        accessor: 'llegada',
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

  const getCellColor = (key) => {
    const map = {
      'Power Point': '#000000', // negro
      PowerPoint: '#000000',    // por si el accessor usa otro nombre
      powerpoint: '#000000',
      Excel: '#e0e0e0',         // gris claro
      excel: '#e0e0e0',
      Word: '#616161',          // gris oscuro
      word: '#616161',
      Access: '#2196f3',        // azul
      access: '#2196f3',
      Publisher: '#ff9800',     // naranja
      publisher: '#ff9800',
    }
    return map[key] ?? 'transparent'
  }

  const average = key => {
    const nums = data.map(r => parseFloat(r[key])).filter(n => !Number.isNaN(n))
    if (nums.length === 0) return ''
    const sum = nums.reduce((a, b) => a + b, 0)
    return (sum / nums.length).toFixed(2)
  }

  const avgRafaga = average('rafaga')
  const avgLlegada = average('llegada')

  // estado para el botón Calcular (solo una vez)
  const [rrCalculated, setRrCalculated] = React.useState(false)
  const rrAdjustment = 3

  const displayedAvgRafaga = (() => {
    if (avgRafaga === '') return ''
    const v = Number(avgRafaga)
    return (rrCalculated ? (v - rrAdjustment) : v).toFixed(2)
  })()

  const displayedAvgLlegada = (() => {
    if (avgLlegada === '') return ''
    const v = Number(avgLlegada)
    return (rrCalculated ? (v - rrAdjustment) : v).toFixed(2)
  })()

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data })

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
          <h1 style={{ textAlign: 'left', margin: 0 }}>Round Robin Quantum 3</h1>

          <div>
            <button
              onClick={() => setRrCalculated(true)}
              disabled={rrCalculated}
              style={{ padding: '8px 12px', cursor: rrCalculated ? 'not-allowed' : 'pointer' }}
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
            return (
              <tr {...row.getRowProps()} key={row.id}>
                {row.cells.map(cell => {
                  // intenta obtener color por column id o por el valor de la celda
                  const bg =
                    getCellColor(cell.column.id) !== 'transparent'
                      ? getCellColor(cell.column.id)
                      : getCellColor(cell.value)

                  // texto blanco para fondos oscuros (negro, gris oscuro, azul)
                  const darkBg = ['#000000', '#616161', '#2196f3'].includes(bg)
                  const color = darkBg ? '#ffffff' : '#000000'

                  return (
                    <td
                      {...cell.getCellProps()}
                      key={cell.column.id}
                      style={{
                        padding: '8px',
                        borderBottom: '1px solid #eee',
                        backgroundColor: bg,
                        color,
                      }}
                    >
                      {cell.render('Cell')}
                    </td>
                  )
                })}
              </tr>
            )
          })}

            <tr>
              <td style={{ padding: '8px', borderTop: '2px solid #ddd', fontWeight: '600' }}>
                Promedio
              </td>
              <td style={{ padding: '8px', borderTop: '2px solid #ddd', fontWeight: '600' }}>
                {displayedAvgRafaga}
              </td>
              <td style={{ padding: '8px', borderTop: '2px solid #ddd', fontWeight: '600' }}>
                {displayedAvgLlegada}
              </td>
            </tr>
          </tbody>
        </table>

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

        {`Promedio de tiempo de espera de RR Quantum 3 en Linux = 36,4 segundos
        
        mientras que en el sistema operativo Microsoft Windows es de 39,4 segundos
        
        y en el tiempo de llegada es de 23,4
        
        mientras que en Microsoft Windows es de 27,4 segundos
        
        Por lo tanto Google nos contrata`}
      </div>
    </div>
  )
}