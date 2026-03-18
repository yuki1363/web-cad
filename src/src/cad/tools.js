// Tool state and drawing logic

import { state, addShape, screenToWorld, selectAt, deleteSelected } from './engine.js'
import { snapToGrid } from './grid.js'
import { saveState } from './history.js'

export const toolState = {
  active: 'line',
  drawing: false,
  startW: null,
  previewShape: null,
  polyPoints: [],
  snapEnabled: true,
  gridSpacing: 50,
  onRedraw: null,
  onStatusUpdate: null,
}

export function setTool(name) {
  toolState.active = name
  toolState.drawing = false
  toolState.previewShape = null
  toolState.polyPoints = []
  toolState.onRedraw?.()
}

function getSnappedWorld(e) {
  const w = screenToWorld(e.offsetX, e.offsetY)
  return snapToGrid(w.x, w.y, toolState.gridSpacing, toolState.snapEnabled)
}

function onMouseDown(e) {
  if (e.button === 1 || e.button === 2) return

  const wpt = getSnappedWorld(e)

  if (toolState.active === 'select') {
    selectAt(wpt.x, wpt.y)
    toolState.onRedraw?.()
    return
  }

  if (toolState.active === 'polyline') {
    if (!toolState.drawing) {
      toolState.drawing = true
      toolState.polyPoints = [wpt]
    } else {
      toolState.polyPoints.push(wpt)
    }
    toolState.onRedraw?.()
    return
  }

  toolState.drawing = true
  toolState.startW = wpt
}

function onMouseMove(e) {
  const wpt = getSnappedWorld(e)
  toolState.onStatusUpdate?.(wpt)

  if (!toolState.drawing) {
    toolState.previewShape = null
    return
  }

  if (toolState.active === 'polyline') {
    if (toolState.polyPoints.length === 0) return
    toolState.previewShape = { type: 'polyline', points: [...toolState.polyPoints, wpt] }
    toolState.onRedraw?.()
    return
  }

  const s = toolState.startW
  if (!s) return

  if (toolState.active === 'line') {
    toolState.previewShape = { type: 'line', x1: s.x, y1: s.y, x2: wpt.x, y2: wpt.y }
  } else if (toolState.active === 'rect') {
    toolState.previewShape = { type: 'rect', x: s.x, y: s.y, w: wpt.x - s.x, h: wpt.y - s.y }
  } else if (toolState.active === 'circle') {
    toolState.previewShape = { type: 'circle', x: s.x, y: s.y, r: Math.hypot(wpt.x - s.x, wpt.y - s.y) }
  }

  toolState.onRedraw?.()
}

function onMouseUp(e) {
  if (e.button !== 0) return
  if (!toolState.drawing) return
  if (toolState.active === 'polyline' || toolState.active === 'select') return

  const wpt = getSnappedWorld(e)
  const s = toolState.startW

  saveState([...state.shapes])

  if (toolState.active === 'line') {
    addShape({ type: 'line', x1: s.x, y1: s.y, x2: wpt.x, y2: wpt.y })
  } else if (toolState.active === 'rect') {
    addShape({ type: 'rect', x: s.x, y: s.y, w: wpt.x - s.x, h: wpt.y - s.y })
  } else if (toolState.active === 'circle') {
    const r = Math.hypot(wpt.x - s.x, wpt.y - s.y)
    if (r > 0) addShape({ type: 'circle', x: s.x, y: s.y, r })
  }

  toolState.drawing = false
  toolState.previewShape = null
  toolState.startW = null
  toolState.onRedraw?.()
}

function onDblClick() {
  if (toolState.active !== 'polyline' || !toolState.drawing) return
  if (toolState.polyPoints.length >= 2) {
    saveState([...state.shapes])
    addShape({ type: 'polyline', points: [...toolState.polyPoints] })
  }
  toolState.drawing = false
  toolState.previewShape = null
  toolState.polyPoints = []
  toolState.onRedraw?.()
}

function onKeyDown(e) {
  if (e.key === 'Escape') {
    toolState.drawing = false
    toolState.previewShape = null
    toolState.polyPoints = []
    toolState.onRedraw?.()
  }
  if ((e.key === 'Delete' || e.key === 'Backspace') && toolState.active === 'select') {
    saveState([...state.shapes])
    deleteSelected()
    toolState.onRedraw?.()
  }
  if (e.key === 'F9') {
    toolState.snapEnabled = !toolState.snapEnabled
    toolState.onStatusUpdate?.()
  }
}

export function initTools(canvas) {
  canvas.addEventListener('mousedown', onMouseDown)
  canvas.addEventListener('mousemove', onMouseMove)
  canvas.addEventListener('mouseup', onMouseUp)
  canvas.addEventListener('dblclick', onDblClick)
  window.addEventListener('keydown', onKeyDown)
}
