import { Context } from "telegraf";
import * as cmd from "./commands/index.js"

import { generarLog, imprimirLogAcesoDenegado } from "./log.js"
import { ComandoUsuario } from "../../database/classes/ComandoUsuario.js";
import { Usuario } from "../../database/classes/Usuario.js";
import { Comando } from "./commands/comando.js";

/**
 * 
 * @param {Context} ctx 
 */
function generarUsuarioSiNoExiste(ctx){
    const { id, first_name, username, is_bot } = ctx.from

    const usuario = new Usuario(id, first_name, username, is_bot)

    usuario.registrarSiNoExiste()
}

/**
 * 
 * @param {Context} ctx 
 */
export async function iniciarComando(ctx){

    generarLog(ctx)
    if(G_genera_usuario) generarUsuarioSiNoExiste(ctx)

    let help = false

    if (ctx.args[0]?.toLowerCase() == "help") help = true

    const acceso_valido = await validarAcceso(ctx)

    if (!acceso_valido) {
        ctx.reply('❌')
        imprimirLogAcesoDenegado(ctx)
        return
    }

    switch (ctx.command) {
        case "start":
            cmd.start(ctx)
            break;
        case "casino":
            cmd.casino(ctx)
            break;
        case "feriados":
            cmd.feriados(ctx)
            break;
        case "azar":
            cmd.azar(ctx, help)
            break;
        case "loto":
            cmd.loto(ctx)
            break;
        case "zoom":
            cmd.zoom(ctx)
            break;
        case "remedios":
            cmd.remedios(ctx)
            break;
        case "ip":
            cmd.ip(ctx)
            break;
        case "timesheet":
            cmd.timesheet(ctx)
            break;
        case "test":
            cmd.test(ctx)
            break;
        case "mpa":
            cmd.mpa(ctx)
            break;
        case "dns":
            cmd.dns(ctx)
            break
        case "help":
            cmd.help(ctx)
            break;
        default:
            break;
    }
}


/**
 * 
 * @param {Context} ctx 
 */
async function validarAcceso(ctx){
    if (!global.G_validar_acceso) return true

    let acceso_valido = false

    const comando = new Comando()
    comando.prompt = ctx.command.replace("'", "")    

    const comandoVigente = await comando.consultarTipoAccesoVigentesPorComando()

    if (!comandoVigente[0]) return false

    const comandoUsuario = new ComandoUsuario()
    comandoUsuario.comando_id   = comandoVigente[0].ID
    comandoUsuario.usuario_id   = ctx.from.id
    comandoUsuario.user_at      = ctx.from.id

    switch (comandoVigente[0].T_ACCESO_ID) {
        case 0:
            acceso_valido = false
            break
        case 1:
            acceso_valido = true
            break
        case 2:
            const comandoUsuarioVigente = await comandoUsuario.consultarPermisoPorUsuario()

            if (comandoUsuarioVigente[0] && comandoUsuarioVigente[0]["COUNT(1)"] > 0) {
                acceso_valido = true
            } else { 
                acceso_valido = false
            }
            break
        default:
            acceso_valido = false
            break
    }

    return acceso_valido
}