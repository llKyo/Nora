import moment from "moment"
import clc from "cli-color"
import { Context } from "telegraf"

import { LogConsulta } from "../../database/classes/LogConsulta.js"

/**
 * 
 * @param {Context} ctx 
 */
function registrarLogConsulta(ctx){
    const logConsulta = new LogConsulta()
    logConsulta.consulta    = ctx.message.text.replace("'", "")
    logConsulta.id_usuario  = ctx.from.id
    logConsulta.usuario     = ctx.from.username
    logConsulta.nombre      = ctx.from.first_name
    logConsulta.r_usuario   = ctx.from.id

    logConsulta.registrar()
}

/**
 * 
 * @param {Context} ctx 
 */
function imprimirConsulta(ctx){

    const ahora = moment().format('YYYY-MM-DD HH:mm:ss')
    const consulta = ctx.message.text
    const id_usuario = ctx.from.id
    const first_name = ctx.from.first_name

    console.log(clc.green(ahora), clc.yellow("🆔:" + id_usuario), clc.blue(first_name), consulta); 
}

/**
 * 
 * @param {Context} ctx 
 */
export function imprimirLogAcesoDenegado(ctx){
    const ahora = moment().format('YYYY-MM-DD HH:mm:ss')
    const consulta = ctx.message.text
    const id_usuario = ctx.from.id
    const first_name = ctx.from.first_name

    console.log(clc.green(ahora), clc.yellow("🆔:" + id_usuario), clc.blue(first_name), consulta, '❌ Acceso Denegado'); 
}

export function generarLog(ctx) {
    imprimirConsulta(ctx)
    registrarLogConsulta(ctx)
}