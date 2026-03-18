// Grid drawing — zoom/pan aware, drawn in screen space

export function drawGrid(ctx, canvas, transform, snapEnabled) {
  const { x: ox, y: oy, scale } = transform
  const w = canvas.width
  const h = canvas.height

  // Pick grid spacing that stays readable at any zoom
  let baseSpacing = 50
  // Adjust so grid lines aren't too dense or too sparse
  let spacing = baseSpacing
  while (spacing * scale < 10) spacing *= 5
  while (spacing * scale > 200) spacing /= 5

  // First grid line in world coords (left/top)
  const startWX = Math.floor(-ox / scale / spacing) * spacing
  const startWY = Math.floor(-oy / scale / spacing) * spacing

  const alpha = Math.min(1, Math.max(0.1, (spacing * scale - 10) / 50))

  ctx.save()
  ctx.setTransform(1, 0, 0, 1, 0, 0)

  // Minor grid
  ctx.strokeStyle = `rgba(30, 41, 59, ${alpha})`
  ctx.lineWidth = 1

  for (let wx = startWX; wx * scale + ox < w + spacing * scale; wx += spacing) {
    const sx = Math.round(wx * scale + ox) + 0.5
    ctx.beginPath()
    ctx.moveTo(sx, 0)
    ctx.lineTo(sx, h)
    ctx.stroke()
  }
  for (let wy = startWY; wy * scale + oy < h + spacing * scale; wy += spacing) {
    const sy = Math.round(wy * scale + oy) + 0.5
    ctx.beginPath()
    ctx.moveTo(0, sy)
    ctx.lineTo(w, sy)
    ctx.stroke()
  }

  // Major grid every 5 lines
  const majorSpacing = spacing * 5
  const startMX = Math.floor(-ox / scale / majorSpacing) * majorSpacing
  const startMY = Math.floor(-oy / scale / majorSpacing) * majorSpacing

  ctx.strokeStyle = `rgba(51, 65, 85, ${Math.min(1, alpha * 1.5)})`
  ctx.lineWidth = 1

  for (let wx = startMX; wx * scale + ox < w + majorSpacing * scale; wx += majorSpacing) {
    const sx = Math.round(wx * scale + ox) + 0.5
    ctx.beginPath()
    ctx.moveTo(sx, 0)
    ctx.lineTo(sx, h)
    ctx.stroke()
  }
  for (let wy = startMY; wy * scale + oy < h + majorSpacing * scale; wy += majorSpacing) {
    const sy = Math.round(wy * scale + oy) + 0.5
    ctx.beginPath()
    ctx.moveTo(0, sy)
    ctx.lineTo(w, sy)
    ctx.stroke()
  }

  // Draw axes (origin lines)
  const originSX = ox
  const originSY = oy
  if (originSX >= 0 && originSX <= w) {
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.6)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(Math.round(originSX) + 0.5, 0)
    ctx.lineTo(Math.round(originSX) + 0.5, h)
    ctx.stroke()
  }
  if (originSY >= 0 && originSY <= h) {
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.6)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, Math.round(originSY) + 0.5)
    ctx.lineTo(w, Math.round(originSY) + 0.5)
    ctx.stroke()
  }

  ctx.restore()
  return spacing
}

export function snapToGrid(wx, wy, spacing, snapEnabled) {
  if (!snapEnabled) return { x: wx, y: wy }
  return {
    x: Math.round(wx / spacing) * spacing,
    y: Math.round(wy / spacing) * spacing,
  }
}
