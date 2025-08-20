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
        await ctx.reply('❌') 
        await ctx.reply('Acceso Denegado.')
        imprimirLogAcesoDenegado(ctx)
        return
    }

    if (typeof cmd[ctx.command] === "function") {
        cmd[ctx.command](ctx, help)
    } else {
        ctx.reply('❓')
    }
}


/**
 * 
 * @param {Context} ctx 
 */
async function validarAcceso(ctx){
    if (!global.G_validar_acceso) return true

    const aListaBlanca = [parseInt(process.env.USER_MASTER), 6167462021]

    if( !aListaBlanca.includes(ctx.from.id) ) 
    {   
        global.G_bot.telegram.sendMessage(process.env.USER_MASTER, `⚠️⚠️⚠️\nRestricción de Acceso.\n\nComando: ${ctx.command}\nID: ${ctx.from.id}\nNombre: ${ ctx.from.username}`)
        return false
    }

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