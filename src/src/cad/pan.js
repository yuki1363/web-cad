let offsetX=0
let offsetY=0

let dragging=false

export function initPan(canvas){

canvas.addEventListener("mousedown",()=>dragging=true)

canvas.addEventListener("mouseup",()=>dragging=false)

canvas.addEventListener("mousemove",(e)=>{

if(!dragging)return

offsetX+=e.movementX
offsetY+=e.movementY

})

}

export function getPan(){

return {offsetX,offsetY}

}
