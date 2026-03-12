let scale=1

export function initZoom(canvas){

canvas.addEventListener("wheel",(e)=>{

e.preventDefault()

if(e.deltaY<0){

scale*=1.1

}else{

scale/=1.1

}

})

}

export function getScale(){

return scale

}
