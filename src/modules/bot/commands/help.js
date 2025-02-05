import { Context } from "telegraf"

/**
 * 
 * @param {Context} ctx 
 */
export function help(ctx){

    const comandos = []

    comandos.push({ prefijo: '/start', descripcion: 'Activación y registro de bot'})
    comandos.push({ prefijo: '/feriados', descripcion: 'Obtiene los feriados publicados por digital.gob de hoy en adelante'})
    comandos.push({ prefijo: '/loto', descripcion: 'Obtiene el monto destinado a repartir de la lotería.'})
    comandos.push({ prefijo: '/zoom', descripcion: 'Compara las IPs publicadas en la documentación de ZOOM contra las de repaldo'})
    comandos.push({ prefijo: '/casino', descripcion: 'Obtiene la minuta de casino PUCV'})
    comandos.push({ prefijo: '/azar [5|6|64]', descripcion: 'Obtiene un número al azar entre 1 y [5|6|64] (5 por defecto)'})
    comandos.push({ prefijo: '/gastos', descripcion: 'Ingresar gastos generales'})
    comandos.push({ prefijo: '/corriente', descripcion: 'Ingresar gastos corriente'})
    comandos.push({ prefijo: '/help', descripcion: 'Lista los comandos con su descripción'})

    let mensaje = '🤖 Listado de comandos:\n\n'

    comandos.forEach(c => {
        mensaje += `${c.prefijo} - ${c.descripcion}.\n`
    })

    ctx.reply(mensaje)
}