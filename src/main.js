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

 shapes.forEach((s,i)=>{

  ctx.beginPath()

  if(s.type==="line"){

   ctx.moveTo(s.x1,s.y1)
   ctx.lineTo(s.x2,s.y2)

  }

  if(i===getSelected()){
   ctx.strokeStyle="red"
  }else{
   ctx.strokeStyle="white"
  }

  ctx.lineWidth=2
  ctx.stroke()

 })

}
document
.getElementById("lineTool")
.onclick=()=>activateTool("line")
document.addEventListener("keydown",(e)=>{

 if(e.key==="Delete"){

  const shapes=getShapes()

  shapes.pop()

  drawAll()

 }

})
import { getSelected, selectShape } from "./cad/engine.js"

canvas.addEventListener("click",(e)=>{

 const x = e.offsetX
 const y = e.offsetY

 const shapes = getShapes()

 shapes.forEach((s,i)=>{

  if(s.type==="line"){

   const dx = s.x2 - s.x1
   const dy = s.y2 - s.y1

   const length = Math.hypot(dx,dy)

   const dist =
   Math.abs(
   (dy*x)-(dx*y)+(s.x2*s.y1)-(s.y2*s.x1)
   )/length

   if(dist < 5){
    selectShape(i)
   }

  }

 })

 drawAll()

})
