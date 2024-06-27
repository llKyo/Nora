import { Usuario } from "../../../database/classes/Usuario.js"

export function start(bot, ctx) {
    const { from } = ctx 
    const { id, first_name, username, is_bot } = from
    
    const usuario = new Usuario(id, first_name, username, is_bot)

    usuario.registrarSiExiste()

    ctx.reply('🖐️')
}