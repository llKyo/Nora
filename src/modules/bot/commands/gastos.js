import moment from "moment"
import { Gasto } from "../../../database/classes/Gasto.js"

export async function gastos (ctx){

    await ctx.scene.enter('cargaGastosScene')
 
    
}

export async function cargarGastoEnBD(ctx){

    const {id_categoria, monto, descripcion, adeudado, letra_adeudado} = ctx.session

    const { id } = ctx.from

    const ahora = moment().format('YYYYMMDD')

    const gasto         = new Gasto()
    gasto.fecha         = ahora
    gasto.fecha_pago    = ahora
    gasto.adeudado      = ''
    gasto.descripcion   = descripcion
    gasto.t_categoria   = id_categoria
    gasto.monto         = monto
    gasto.user_at       = 'NoraBot:' + id
    
    gasto.insertarGasto().then(async resp => {
        if (resp.affectedRows <= 0) ctx.reply('Error en carga 1')
        
        if (adeudado) {
    
            gasto.fecha_pago = ''
            gasto.adeudado = letra_adeudado
            gasto.descripcion = 'Abono ' + gasto.descripcion
            gasto.monto = monto * -1

            gasto.insertarGasto().then(async resp =>  {

                if (resp.affectedRows > 0) {
                    await ctx.reply(`Deuda cargada.`) 
                    await ctx.reply(`👛`) 
                } else {
                    await ctx.reply(`Error Carga 2.`)
                }
            })

        } else {
            await ctx.reply('Gasto cargado.')
            await ctx.reply('💰')
        }
        
    }).catch(err => {
        ctx.reply('Error Carga 1')
    })
    


    
    
    
}