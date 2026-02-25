type NullCell = string | { val: string; color: string };

export default function NullDiagram() {
  const cellW = 100;
  const cellH = 36;
  const headers = ['A', 'B', 'A = B'];
  const rows: NullCell[][] = [
    ['TRUE', 'TRUE', { val: 'TRUE', color: '#16A34A' }],
    ['TRUE', 'FALSE', { val: 'FALSE', color: '#DC2626' }],
    ['TRUE', 'NULL', { val: 'NULL', color: '#D97706' }],
    ['FALSE', 'NULL', { val: 'NULL', color: '#D97706' }],
    ['NULL', 'NULL', { val: 'NULL', color: '#D97706' }],
  ];

  return (
    <div style={{ margin: '2rem 0', textAlign: 'center' }}>
      <svg viewBox={`0 0 ${cellW * 3 + 20} ${cellH * (rows.length + 1) + 20}`}
        width={cellW * 3 + 20} style={{ maxWidth: '100%' }}>
        {/* Header */}
        {headers.map((h, i) => (
          <g key={`h-${i}`}>
            <rect x={10 + i * cellW} y={10} width={cellW} height={cellH}
              fill="#F6F8FA" stroke="#E2E5E9" strokeWidth="1" />
            <text x={10 + i * cellW + cellW / 2} y={10 + cellH / 2 + 1}
              textAnchor="middle" dominantBaseline="middle"
              fontSize="12" fontWeight="600" fill="#1F2328">{h}</text>
          </g>
        ))}
        {/* Rows */}
        {rows.map((row, ri) => (
          row.map((cell, ci) => {
            const val = typeof cell === 'object' ? cell.val : cell;
            const color = typeof cell === 'object' ? cell.color : '#1F2328';
            const bg = val === 'NULL' ? '#FFFBEB' : 'white';
            return (
              <g key={`${ri}-${ci}`}>
                <rect x={10 + ci * cellW} y={10 + (ri + 1) * cellH} width={cellW} height={cellH}
                  fill={bg} stroke="#E2E5E9" strokeWidth="1" />
                <text x={10 + ci * cellW + cellW / 2} y={10 + (ri + 1) * cellH + cellH / 2 + 1}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize="12" fontWeight={val === 'NULL' ? 600 : 400}
                  fontFamily="var(--font-mono)" fill={color}>{val}</text>
              </g>
            );
          })
        ))}
      </svg>
      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
        Three-valued logic: comparisons with NULL yield NULL, not TRUE or FALSE
      </div>
    </div>
  );
}
