import {initEngine} from "./cad/engine.js"
import {drawScene} from "./cad/draw.js"
import {initZoom} from "./cad/zoom.js"
import {initPan} from "./cad/pan.js"

const canvas=document.getElementById("canvas")

canvas.width=window.innerWidth
canvas.height=window.innerHeight-50

initEngine(canvas)

initZoom(canvas)
initPan(canvas)

drawScene()
