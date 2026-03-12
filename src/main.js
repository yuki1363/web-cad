import { startEngine } from "./cad/engine.js"
import { activateTool } from "./cad/tools.js"

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight - 50

startEngine()

let drawing = false
let startX = 0
let startY = 0

canvas.addEventListener("mousedown", (e)=>{

 drawing = true
 startX = e.offsetX
 startY = e.offsetY

})

canvas.addEventListener("mouseup", (e)=>{

 if(!drawing) return

 const endX = e.offsetX
 const endY = e.offsetY

 ctx.beginPath()
 ctx.moveTo(startX,startY)
 ctx.lineTo(endX,endY)
 ctx.strokeStyle="white"
 ctx.lineWidth=2
 ctx.stroke()

 drawing = false

})

document
.getElementById("lineTool")
.onclick=()=>activateTool("line")
