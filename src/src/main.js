import { state, applyTransform, resetTransform, zoomAt, pan, renderShapes } from './cad/engine.js'
import { drawGrid, snapToGrid } from './cad/grid.js'
import { toolState, setTool, initTools } from './cad/tools.js'
import { undo, redo, saveState } from './cad/history.js'
import { downloadDXF } from './cad/dxf.js'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const coordDisplay = document.getElementById('coords')
const snapBtn = document.getElementById('snapBtn')

function resize() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight - document.getElementById('toolbar').offsetHeight
  redraw()
}

window.addEventListener('resize', resize)
resize()

// ── Zoom ──────────────────────────────────────────────────────────────────────
canvas.addEventListener('wheel', e => {
  e.preventDefault()
  const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12
  zoomAt(e.offsetX, e.offsetY, factor)
  redraw()
}, { passive: false })

// ── Pan (middle mouse or space+drag) ─────────────────────────────────────────
let panning = false
let panStart = null
let spaceDown = false

window.addEventListener('keydown', e => { if (e.code === 'Space') { spaceDown = true; e.preventDefault() } })
window.addEventListener('keyup',   e => { if (e.code === 'Space') spaceDown = false })

canvas.addEventListener('mousedown', e => {
  if (e.button === 1 || spaceDown) {
    panning = true
    panStart = { x: e.clientX, y: e.clientY }
    e.preventDefault()
  }
})
window.addEventListener('mousemove', e => {
  if (!panning) return
  pan(e.clientX - panStart.x, e.clientY - panStart.y)
  panStart = { x: e.clientX, y: e.clientY }
  redraw()
})
window.addEventListener('mouseup', e => {
  if (e.button === 1 || panning) panning = false
})
canvas.addEventListener('contextmenu', e => e.preventDefault())

// ── Tools ─────────────────────────────────────────────────────────────────────
initTools(canvas)

toolState.onRedraw = redraw
toolState.onStatusUpdate = (wpt) => {
  if (wpt) {
    coordDisplay.textContent = `X: ${wpt.x.toFixed(1)}  Y: ${(-wpt.y).toFixed(1)}`
  }
  snapBtn.textContent = `Snap: ${toolState.snapEnabled ? 'ON' : 'OFF'}`
  snapBtn.classList.toggle('active', toolState.snapEnabled)
}

// ── Toolbar buttons ───────────────────────────────────────────────────────────
const toolButtons = document.querySelectorAll('[data-tool]')
toolButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    setTool(btn.dataset.tool)
    toolButtons.forEach(b => b.classList.toggle('active', b.dataset.tool === btn.dataset.tool))
  })
})

document.getElementById('undoBtn').addEventListener('click', () => {
  const prev = undo(state.shapes)
  if (prev) { state.shapes = prev; state.selected.clear(); redraw() }
})
document.getElementById('redoBtn').addEventListener('click', () => {
  const next = redo(state.shapes)
  if (next) { state.shapes = next; state.selected.clear(); redraw() }
})
document.getElementById('saveDXF').addEventListener('click', () => downloadDXF(state.shapes))
document.getElementById('clearBtn').addEventListener('click', () => {
  saveState([...state.shapes])
  state.shapes = []
  state.selected.clear()
  redraw()
})

snapBtn.addEventListener('click', () => {
  toolState.snapEnabled = !toolState.snapEnabled
  toolState.onStatusUpdate?.()
})

// Keyboard shortcuts
window.addEventListener('keydown', e => {
  const map = { l: 'line', r: 'rect', c: 'circle', p: 'polyline', s: 'select' }
  if (map[e.key] && !e.ctrlKey && !e.metaKey) {
    setTool(map[e.key])
    toolButtons.forEach(b => b.classList.toggle('active', b.dataset.tool === map[e.key]))
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
    e.preventDefault()
    const prev = undo(state.shapes)
    if (prev) { state.shapes = prev; state.selected.clear(); redraw() }
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
    e.preventDefault()
    const next = redo(state.shapes)
    if (next) { state.shapes = next; state.selected.clear(); redraw() }
  }
})

// ── Render ────────────────────────────────────────────────────────────────────
let gridSpacing = 50

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  gridSpacing = drawGrid(ctx, canvas, state.transform, toolState.snapEnabled)
  toolState.gridSpacing = gridSpacing

  applyTransform(ctx)
  renderShapes(ctx, toolState.previewShape)
  resetTransform(ctx)

  // Snap indicator: small crosshair at cursor snap point
}

redraw()

// Set default active tool button
document.querySelector('[data-tool="line"]')?.classList.add('active')
toolState.onStatusUpdate?.({ x: 0, y: 0 })
