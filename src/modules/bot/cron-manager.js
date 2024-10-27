import nodeCron from "node-cron"
import * as cmd from "./commands/index.js"
import { AgendaCron } from "../../database/classes/AgendaCron.js"
import { generarLog, imprimirRespuesta } from "./log.js";
import { DestinatarioCron } from "../../database/classes/DestinatarioCron.js";


function ejecutarCron(funcion){

    const comando = `/${funcion}`

    let ctxCron = {
        chat: {id: 0},
        from: {id: 0,first_name: "CRON",username: "CRON"},
        message: {text: comando},
    }

    generarLog(ctxCron)
    
    switch (comando) {
        case "/casino":
            cmd.casino(ctxCron, true)
            break
        case "/zoom":
            cmd.zoom(ctxCron, true)
            break
        case "/loto":
            cmd.loto(ctxCron, true)
            break
        case "/remedios":
            // cmd.remedios(ctxCron, true)
            break
        default:
            break
    }
}

export async function cargarCrons(){
    const agendaCron = new AgendaCron()

    agendaCron.obtenerTodosLosCronVigentes().then(agendasCron => {

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
    }).catch(err => console.error(`\n🔴  ERROR AL CARGAR CRONS`))

    
}

export async function obtenerDestinatariosCron(comando_id, esCron) {
    const destinatarioCron = new DestinatarioCron()
    destinatarioCron.comando_id = comando_id
    
    const destinatarios =  await destinatarioCron.obtenerDestinatarioPorFuncionCron()

    const nombre = esCron ? "CRON" : "BOT"

    destinatarios.forEach(destinatario => imprimirRespuesta(comando_id, destinatario, nombre))

    return destinatarios
}