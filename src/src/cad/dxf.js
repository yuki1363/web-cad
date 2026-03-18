export function exportDXF(shapes) {
  let dxf = '0\nSECTION\n2\nENTITIES\n'

  shapes.forEach(s => {
    if (s.type === 'line') {
      dxf += `0\nLINE\n8\n0\n10\n${s.x1}\n20\n${-s.y1}\n30\n0\n11\n${s.x2}\n21\n${-s.y2}\n31\n0\n`
    } else if (s.type === 'rect') {
      const x1 = s.x, y1 = s.y, x2 = s.x + s.w, y2 = s.y + s.h
      dxf += `0\nLWPOLYLINE\n8\n0\n90\n4\n70\n1\n`
      dxf += `10\n${x1}\n20\n${-y1}\n`
      dxf += `10\n${x2}\n20\n${-y1}\n`
      dxf += `10\n${x2}\n20\n${-y2}\n`
      dxf += `10\n${x1}\n20\n${-y2}\n`
    } else if (s.type === 'circle') {
      dxf += `0\nCIRCLE\n8\n0\n10\n${s.x}\n20\n${-s.y}\n30\n0\n40\n${s.r}\n`
    } else if (s.type === 'polyline') {
      const pts = s.points
      dxf += `0\nLWPOLYLINE\n8\n0\n90\n${pts.length}\n70\n0\n`
      pts.forEach(p => { dxf += `10\n${p.x}\n20\n${-p.y}\n` })
    }
  })

  dxf += '0\nENDSEC\n0\nEOF\n'
  return dxf
}

export function downloadDXF(shapes) {
  const content = exportDXF(shapes)
  const blob = new Blob([content], { type: 'application/octet-stream' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'drawing.dxf'
  a.click()
  URL.revokeObjectURL(url)
}
