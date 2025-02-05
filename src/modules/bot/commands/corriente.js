import { Gasto } from "../../../database/classes/Gasto.js";

export function corriente(ctx) {
    
    ctx.session = { __scenes: ctx.session.__scenes || {} };
    
    ctx.scene.enter('cargaGastoCorriente')
}


export function cargarGastoTransporteDB(ctx){

    console.log();

    const gasto_corriente = new Gasto()
    gasto_corriente.t_categoria = ctx.session.t_categoria
    gasto_corriente.monto = ctx.session.monto

    gasto_corriente.actualizarOInsertarGastoCorriente()
    .then(async resp => {

        if (resp.affectedRows > 0) {
            await ctx.reply('Gasto corriente cargado.')

            switch (ctx.session.t_categoria) {
                case 2:
                    await ctx.reply('🍔')
                    break;
                case 10:
                    await ctx.reply('🚗')
                    break;
                default:
                    await ctx.reply('💰')
                    break;
            }
        }
        
    }).catch(err => {
        ctx.reply('❌ Se ha producido un error inesperado.')
        
    })
    

}