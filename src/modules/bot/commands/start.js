import { Context } from "telegraf"
import { Usuario } from "../../../database/classes/Usuario.js"

/**
 * 
 * @param {Context} ctx 
 */
export function start(ctx) {
    const { id, first_name, username, is_bot } = ctx.from

    const usuario = new Usuario(id, first_name, username, is_bot)

    usuario.siExiste()

    ctx.reply('🖐️')
}