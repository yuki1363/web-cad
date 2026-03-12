export const shapes=[]

let selected=-1

export function addShape(shape){

shapes.push(shape)

}

export function getShapes(){

return shapes

}

export function selectShape(index){

selected=index

}

export function getSelected(){

return selected

}

export function deleteShape(){

if(selected>=0){

shapes.splice(selected,1)
selected=-1

}

}
