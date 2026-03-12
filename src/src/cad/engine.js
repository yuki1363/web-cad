export let shapes=[]
export let selected=-1

export function initEngine(canvas){

canvas.addEventListener("click",selectShape)

}

function selectShape(e){

const x=e.offsetX
const y=e.offsetY

shapes.forEach((s,i)=>{

if(s.type==="rect"){

if(
x>s.x &&
x<s.x+s.w &&
y>s.y &&
y<s.y+s.h
){

selected=i

}

}

})

}
