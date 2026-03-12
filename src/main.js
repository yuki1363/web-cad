const canvas=document.getElementById("canvas")
const ctx=canvas.getContext("2d")

canvas.width=window.innerWidth
canvas.height=window.innerHeight-50

let mode="line"

let shapes=[]

let startX
let startY
let drawing=false

document.getElementById("line").onclick=()=>mode="line"
document.getElementById("rect").onclick=()=>mode="rect"
document.getElementById("circle").onclick=()=>mode="circle"

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

shapes.push({
type:"line",
x1:startX,
y1:startY,
x2:x,
y2:y
})

}

if(mode==="rect"){

shapes.push({
type:"rect",
x:startX,
y:startY,
w:x-startX,
h:y-startY
})

}

if(mode==="circle"){

const r=Math.hypot(x-startX,y-startY)

shapes.push({
type:"circle",
x:startX,
y:startY,
r:r
})

}

draw()

})

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height)

drawGrid()

shapes.forEach(s=>{

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

ctx.strokeStyle="white"
ctx.lineWidth=2
ctx.stroke()

})

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

draw()
