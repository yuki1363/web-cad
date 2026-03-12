export function exportDXF(shapes){

let dxf="0\nSECTION\n2\nENTITIES\n"

shapes.forEach(s=>{

if(s.type==="line"){

dxf+=`
0
LINE
8
0
10
${s.x1}
20
${s.y1}
11
${s.x2}
21
${s.y2}
`

}

})

dxf+="0\nENDSEC\n0\nEOF"

return dxf

}
