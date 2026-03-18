// Core rendering engine with zoom/pan transforms

export const state = {
  shapes: [],
  selected: new Set(),
  transform: { x: 0, y: 0, scale: 1 },
}

// Convert screen coords to world coords
export function screenToWorld(sx, sy) {
  const { x, y, scale } = state.transform
  return {
    x: (sx - x) / scale,
    y: (sy - y) / scale,
  }
}

// Convert world coords to screen coords
export function worldToScreen(wx, wy) {
  const { x, y, scale } = state.transform
  return {
    x: wx * scale + x,
    y: wy * scale + y,
  }
}

export function applyTransform(ctx) {
  const { x, y, scale } = state.transform
  ctx.setTransform(scale, 0, 0, scale, x, y)
}

export function resetTransform(ctx) {
  ctx.setTransform(1, 0, 0, 1, 0, 0)
}

export function zoomAt(screenX, screenY, factor) {
  const { x, y, scale } = state.transform
  const newScale = Math.min(Math.max(scale * factor, 0.05), 200)
  // Keep point under cursor fixed
  state.transform.x = screenX - (screenX - x) * (newScale / scale)
  state.transform.y = screenY - (screenY - y) * (newScale / scale)
  state.transform.scale = newScale
}

export function pan(dx, dy) {
  state.transform.x += dx
  state.transform.y += dy
}

export function addShape(shape) {
  state.shapes.push(shape)
}

export function deleteSelected() {
  const toDelete = state.selected
  state.shapes = state.shapes.filter((_, i) => !toDelete.has(i))
  state.selected.clear()
}

export function clearSelection() {
  state.selected.clear()
}

export function selectAt(wx, wy) {
  // Find topmost shape at world point
  for (let i = state.shapes.length - 1; i >= 0; i--) {
    if (hitTest(state.shapes[i], wx, wy)) {
      state.selected.clear()
      state.selected.add(i)
      return true
    }
  }
  state.selected.clear()
  return false
}

function hitTest(s, x, y) {
  const THRESH = 5
  if (s.type === 'line') {
    return distToSegment(x, y, s.x1, s.y1, s.x2, s.y2) < THRESH
  }
  if (s.type === 'rect') {
    const mx = Math.min(s.x, s.x + s.w), Mx = Math.max(s.x, s.x + s.w)
    const my = Math.min(s.y, s.y + s.h), My = Math.max(s.y, s.y + s.h)
    // Hit on border
    const onH = y > my - THRESH && y < My + THRESH
    const onV = x > mx - THRESH && x < Mx + THRESH
    const nearLeft = Math.abs(x - mx) < THRESH && onH
    const nearRight = Math.abs(x - Mx) < THRESH && onH
    const nearTop = Math.abs(y - my) < THRESH && onV
    const nearBottom = Math.abs(y - My) < THRESH && onV
    return nearLeft || nearRight || nearTop || nearBottom
  }
  if (s.type === 'circle') {
    const d = Math.hypot(x - s.x, y - s.y)
    return Math.abs(d - s.r) < THRESH
  }
  if (s.type === 'polyline') {
    for (let i = 0; i < s.points.length - 1; i++) {
      const p1 = s.points[i], p2 = s.points[i + 1]
      if (distToSegment(x, y, p1.x, p1.y, p2.x, p2.y) < THRESH) return true
    }
  }
  return false
}

function distToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay
  if (dx === 0 && dy === 0) return Math.hypot(px - ax, py - ay)
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)))
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy))
}

export function renderShapes(ctx, previewShape) {
  // Draw all shapes
  state.shapes.forEach((s, i) => {
    const isSelected = state.selected.has(i)
    drawShape(ctx, s, isSelected ? '#38bdf8' : '#e2e8f0', isSelected ? 2.5 : 1.5)
  })
  // Draw preview shape
  if (previewShape) {
    drawShape(ctx, previewShape, '#facc15', 1.5, true)
  }
}

export function drawShape(ctx, s, color = '#e2e8f0', width = 1.5, dashed = false) {
  ctx.beginPath()
  ctx.strokeStyle = color
  ctx.lineWidth = width / state.transform.scale
  if (dashed) {
    ctx.setLineDash([6 / state.transform.scale, 4 / state.transform.scale])
  } else {
    ctx.setLineDash([])
  }

  if (s.type === 'line') {
    ctx.moveTo(s.x1, s.y1)
    ctx.lineTo(s.x2, s.y2)
  } else if (s.type === 'rect') {
    ctx.rect(s.x, s.y, s.w, s.h)
  } else if (s.type === 'circle') {
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
  } else if (s.type === 'polyline') {
    if (s.points.length < 2) return
    ctx.moveTo(s.points[0].x, s.points[0].y)
    for (let i = 1; i < s.points.length; i++) {
      ctx.lineTo(s.points[i].x, s.points[i].y)
    }
  }

  ctx.stroke()
  ctx.setLineDash([])
}
