export function tranporte(ctx) {
    
    ctx.session = { __scenes: ctx.session.__scenes || {} };

    ctx.scene.enter('cargaGastoTransporte')
}


export function cargarGastoTransporteDB(ctx){

    console.log(ctx.session);
    

}