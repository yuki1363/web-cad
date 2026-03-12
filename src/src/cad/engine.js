export const shapes = []

let selectedIndex = -1

export function startEngine(){
 console.log("CAD Engine Started")
}

export function addShape(shape){
 shapes.push(shape)
}

export function getShapes(){
 return shapes
}

export function selectShape(index){
 selectedIndex = index
}

export function getSelected(){
 return selectedIndex
}
