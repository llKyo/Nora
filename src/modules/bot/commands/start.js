import { Usuario } from "../../../database/classes/Usuario.js"

export function start(ctx) {
    const { id, first_name, username, is_bot } = ctx.from

    const usuario = new Usuario(id, first_name, username, is_bot)

    usuario.registrarSiNoExiste()

    ctx.reply('🖐️')
}