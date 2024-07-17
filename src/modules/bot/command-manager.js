import { Context } from "telegraf";
import * as cmd from "./commands/index.js"

import { generarLog, imprimirLogAcesoDenegado } from "./log.js"
import { Permiso } from "../../database/classes/Permiso.js";
import { PermisoUsuario } from "../../database/classes/PermisoUsuario.js";
import { Usuario } from "../../database/classes/Usuario.js";

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

    const permiso = new Permiso()
    permiso.comando = ctx.command.replace("'", "")

    const permisosVigentes = await permiso.consultarPermisosVigentesPorComando()

    if (!permisosVigentes[0]) return false

    const permisoUsuario = new PermisoUsuario()
    permisoUsuario.id_permiso   = permisosVigentes[0].ID
    permisoUsuario.id_usuario   = ctx.from.id
    permisoUsuario.r_usuario    = ctx.from.id

    switch (permisosVigentes[0].T_ACCESO) {
        case 0:
            acceso_valido = false
            break
        case 1:
            acceso_valido = true
            break
        case 2:
            const permisoUsuarioVigente = await permisoUsuario.consultarPermisoPorUsuario()

            if (permisoUsuarioVigente[0] && permisoUsuarioVigente[0]["COUNT(1)"] > 0) {
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