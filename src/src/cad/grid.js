export function drawGrid(ctx,width,height){

ctx.strokeStyle="#1e293b"

for(let x=0;x<width;x+=50){

ctx.beginPath()
ctx.moveTo(x,0)
ctx.lineTo(x,height)
ctx.stroke()

}

for(let y=0;y<height;y+=50){

ctx.beginPath()
ctx.moveTo(0,y)
ctx.lineTo(width,y)
ctx.stroke()

}

}
