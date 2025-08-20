import { obtenerDestinatariosCron } from "../cron-manager.js";

async function obtenerTareasHoy(){
    
    try {
        const data = await global.todoApi.getTasks({ filter: "today" })
        return data.results
    } catch (error) {
        
        return []
    }

}

async function obtenerTareasVencidas(){
    
    try {
        const data = await global.todoApi.getTasks({ filter: "overdue" })
        return data.results
    } catch (error) {
        
        return []
    }
    
}

function escapeMarkdownV2(texto) {
    return texto.replace(/([_*[\]()~`>#+\-=|{}.!])/g, "\\$1");
}

export async function hoy(ctx, esCron = false){
    const tareasHoy = await obtenerTareasHoy()
    const tareasVencidas = await obtenerTareasVencidas()

    const cantidadHoy = tareasHoy.length
    const cantidadVencidas = tareasVencidas.length

    if (cantidadHoy == 0 && cantidadVencidas == 0) {
        if (!esCron) {
            await ctx.reply(`✨ No quedan tareas para el día de hoy.`)
            await ctx.reply('😄')
        }
        return
    }

    let mensaje = ''
    let indice = 1

    if (cantidadHoy > 0) {
        mensaje += `➡️ `
        mensaje += cantidadHoy == 1 ? 'Hay 1 tarea para el dia de hoy\\. 😯' : `Hay ${cantidadHoy} tareas para el dia de hoy\\. 😊`
        mensaje += `\n\n`

        for (const tarea of tareasHoy) {        
            mensaje +=  `${indice}\\. ${escapeMarkdownV2(tarea.content)} \\- [Link 🌐](${tarea.url})\n`
            indice++
        }

        mensaje += `\n`
    }

    if (cantidadVencidas > 0) {
        indice = 1

        mensaje += `⚠️ `
        mensaje += cantidadVencidas == 1 ? `Quedó una tarea atrasada de días anteriores\\.` : `Quedan ${cantidadVencidas} tareas atradas de días anteriores\\.`
        mensaje += `\n\n`

        for (const tarea of tareasVencidas) {        
            mensaje +=  `${indice}\\. ${escapeMarkdownV2(tarea.content)} \\- [Link 🌐](${tarea.url})\n`
            indice++
        }
    }

    if (!esCron) {
        ctx.reply(mensaje, {parse_mode: "MarkdownV2", disable_web_page_preview: true})
    } else {
        const destinatarios = await obtenerDestinatariosCron(16, esCron)
            
        destinatarios.forEach(destinatario => {             
            global.G_bot.telegram.sendMessage(destinatario.USUARIO_ID, mensaje, {parse_mode: "MarkdownV2", disable_web_page_preview: true})
        });
    }
}
