import nodeCron from "node-cron"
import * as cmd from "./commands/index.js"
import { AgendaCron } from "../../database/classes/AgendaCron.js"
import { generarLog, imprimirRespuesta } from "./log.js";
import { DestinatarioCron } from "../../database/classes/DestinatarioCron.js";

// https://cronexpressiontogo.com/every-minute

export function ejecutarCron(funcion){

    let ctxCron = {
        chat: {id: -1},
        from: {id: -1,first_name: "CRON",username: "CRON"},
        message: {text: funcion},
    }

    generarLog(ctxCron)

    switch (funcion) {
        case "casino":
            cmd.casino(ctxCron, true)
            break
        case "zoom":
            cmd.zoom(ctxCron, true)
            break
        case "loto":
            cmd.loto(ctxCron, true)
            break
        case "remedios":
            cmd.remedios(ctxCron, true)
            break
        case "timesheet":
            cmd.timesheet(ctxCron, true)
            break
        case "mpa":
            cmd.mpa(ctxCron, true)
            break
        default:
            break
    }
}

export async function cargarCrons(){
    const agendaCron = new AgendaCron()

    const agendasCron = await agendaCron.obtenerTodosLosCronVigentes()

    agendasCron.forEach(agendaCron => {
        nodeCron.schedule(agendaCron.EXPRESION_CRON, () => ejecutarCron(agendaCron.PROMPT))
    });

    if (G_print_crons) {
        if (agendasCron && agendasCron.length > 0) {
            console.log('⏰ Crons Agendados.\n')
            console.table(agendasCron)
            console.log('\n')
        } else {
            console.log('💠 Sin Crons Agendados.\n')
        }
    }
}

export async function obtenerDestinatariosCron(comando_id, esCron) {
    const destinatarioCron = new DestinatarioCron()
    destinatarioCron.comando_id = comando_id
    
    const destinatarios =  await destinatarioCron.obtenerDestinatarioPorFuncionCron()

    const nombre = esCron ? "CRON" : "BOT"

    destinatarios.forEach(destinatario => imprimirRespuesta(destinatario.PROMPT, destinatario, nombre))

    return destinatarios
}