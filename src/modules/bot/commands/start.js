import { Usuario } from "../../../database/classes/Usuario.js"

export function start(bot, ctx) {
    const { id, first_name, username, is_bot } = ctx.from

    const usuario = new Usuario(id, first_name, username, is_bot)

    usuario.registrarSiExiste()

    ctx.reply('🖐️')
}