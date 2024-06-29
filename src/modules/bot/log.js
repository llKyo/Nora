import moment from "moment"
import clc from "cli-color"
import { LogConsulta } from "../../database/classes/LogConsulta.js"


function registrarLogConsulta(ctx){
    const logConsulta = new LogConsulta()
    logConsulta.consulta    = ctx.message.text.replace("'", "")
    logConsulta.id_usuario  = ctx.from.id
    logConsulta.r_usuario   = ctx.from.id
    logConsulta.registrar()
}

function imprimirConsulta(ctx){

    const ahora = moment().format('YYYY-MM-DD HH:mm:ss')
    const consulta = ctx.message.text
    const id_usuario = ctx.from.id
    const first_name = ctx.from.first_name

    console.log(clc.green(ahora), clc.yellow("🆔:" + id_usuario), clc.blue(first_name), consulta); 
}

export function generarLog(ctx) {
    imprimirConsulta(ctx)
    registrarLogConsulta(ctx)
}