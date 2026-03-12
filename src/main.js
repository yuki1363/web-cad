import {
addShape,
getShapes,
selectShape,
getSelected,
deleteShape
}
from "./cad/engine.js"

const canvas=document.getElementById("canvas")
const ctx=canvas.getContext("2d")

canvas.width=window.innerWidth
canvas.height=window.innerHeight-50

let mode="line"

let startX=0
let startY=0
let drawing=false


document
.getElementById("lineTool")
.onclick=()=>mode="line"

document
.getElementById("rectTool")
.onclick=()=>mode="rect"

document
.getElementById("circleTool")
.onclick=()=>mode="circle"

document
.getElementById("deleteTool")
.onclick=()=>{

deleteShape()
draw()

}


canvas.addEventListener("mousedown",(e)=>{

drawing=true

startX=e.offsetX
startY=e.offsetY

})


canvas.addEventListener("mouseup",(e)=>{

if(!drawing)return

drawing=false

const x=e.offsetX
const y=e.offsetY


if(mode==="line"){

addShape({
type:"line",
x1:startX,
y1:startY,
x2:x,
y2:y
})

}


if(mode==="rect"){

addShape({
type:"rect",
x:startX,
y:startY,
w:x-startX,
h:y-startY
})

}


if(mode==="circle"){

const r=Math.hypot(x-startX,y-startY)

addShape({
type:"circle",
x:startX,
y:startY,
r:r
})

}


draw()

})


canvas.addEventListener("click",(e)=>{

const x=e.offsetX
const y=e.offsetY

const shapes=getShapes()

shapes.forEach((s,i)=>{

if(s.type==="rect"){

if(
x>s.x &&
x<s.x+s.w &&
y>s.y &&
y<s.y+s.h
){

selectShape(i)

}

}

if(s.type==="circle"){

const d=Math.hypot(x-s.x,y-s.y)

if(d<s.r){

selectShape(i)

}

}

})

draw()

})


document.addEventListener("keydown",(e)=>{

const index=getSelected()

if(index<0)return

const shape=getShapes()[index]


if(e.key==="ArrowUp") move(shape,0,-5)
if(e.key==="ArrowDown") move(shape,0,5)
if(e.key==="ArrowLeft") move(shape,-5,0)
if(e.key==="ArrowRight") move(shape,5,0)

draw()

})


function move(shape,dx,dy){

if(shape.type==="line"){

shape.x1+=dx
shape.y1+=dy
shape.x2+=dx
shape.y2+=dy

}

if(shape.type==="rect"){

shape.x+=dx
shape.y+=dy

}

if(shape.type==="circle"){

shape.x+=dx
shape.y+=dy

}

}


function drawGrid(){

ctx.strokeStyle="#1e293b"

for(let x=0;x<canvas.width;x+=50){

ctx.beginPath()
ctx.moveTo(x,0)
ctx.lineTo(x,canvas.height)
ctx.stroke()

}

for(let y=0;y<canvas.height;y+=50){

ctx.beginPath()
ctx.moveTo(0,y)
ctx.lineTo(canvas.width,y)
ctx.stroke()

}

}


function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height)

drawGrid()

const shapes=getShapes()

shapes.forEach((s,i)=>{

ctx.beginPath()

if(s.type==="line"){

ctx.moveTo(s.x1,s.y1)
ctx.lineTo(s.x2,s.y2)

}

if(s.type==="rect"){

ctx.rect(s.x,s.y,s.w,s.h)

}

if(s.type==="circle"){

ctx.arc(s.x,s.y,s.r,0,Math.PI*2)

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

draw()
