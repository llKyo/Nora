import { obtenerDestinatariosCron } from "../cron-manager.js";

async function obtenerTareasHoy(){
    
    try {
        const data = await global.todoApi.getTasks({ filter: "today" })
        return data.results
    } catch (error) {
        
        return []
    }

}

function escapeMarkdownV2(texto) {
    return texto.replace(/([_*[\]()~`>#+\-=|{}.!])/g, "\\$1");
}

export async function hoy(ctx, esCron = false){
    const tareas = await obtenerTareasHoy()

    const cantidad = tareas.length

    if (cantidad == 0) {
        if (!esCron) {
            await ctx.reply(`✨ No quedan tareas para el día de hoy.`)
            await ctx.reply('😄')
        }
        return
    }

    let mensaje = `➡️ `
    mensaje += cantidad == 1 ? 'Hay 1 tarea pendiente\\.' : `Hay ${cantidad} tareas pendientes\\.`
    mensaje += `\n\n`

    let indice = 1

    for (const tarea of tareas) {        
        mensaje +=  `${indice}\\. ${escapeMarkdownV2(tarea.content)} \\- [Link 🌐](${tarea.url})\n`
        indice++
    }

    if (!esCron) {
        ctx.reply(mensaje, {parse_mode: "MarkdownV2", disable_web_page_preview: true})
    } else {
        const destinatarios = await obtenerDestinatariosCron(16, esCron)
            
        destinatarios.forEach(destinatario => {             
            global.G_bot.telegram.sendMessage(destinatario.USUARIO_ID, mensaje)
        });
    }
}
