let undoStack=[]
let redoStack=[]

export function saveState(state){

undoStack.push(JSON.stringify(state))

}

export function undo(shapes){

if(undoStack.length===0)return

redoStack.push(JSON.stringify(shapes))

return JSON.parse(undoStack.pop())

}

export function redo(shapes){

if(redoStack.length===0)return

undoStack.push(JSON.stringify(shapes))

return JSON.parse(redoStack.pop())

}
