import { startEngine, addShape, getShapes } from "./cad/engine.js"
import { activateTool } from "./cad/tools.js"

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight - 50

startEngine()

let drawing = false
let startX = 0
let startY = 0

canvas.addEventListener("mousedown",(e)=>{

 drawing = true
 startX = e.offsetX
 startY = e.offsetY

})

canvas.addEventListener("mouseup",(e)=>{

 if(!drawing) return

 const endX = e.offsetX
 const endY = e.offsetY

 addShape({
  type:"line",
  x1:startX,
  y1:startY,
  x2:endX,
  y2:endY
 })

 drawAll()

 drawing=false

})

function drawAll(){

 ctx.clearRect(0,0,canvas.width,canvas.height)

 const shapes = getShapes()

 shapes.forEach(s=>{

  if(s.type==="line"){

   ctx.beginPath()
   ctx.moveTo(s.x1,s.y1)
   ctx.lineTo(s.x2,s.y2)
   ctx.strokeStyle="white"
   ctx.lineWidth=2
   ctx.stroke()

  }

 })

}

document
.getElementById("lineTool")
.onclick=()=>activateTool("line")
