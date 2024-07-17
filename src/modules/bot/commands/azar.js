import { Context } from "telegraf";

/**
 * 
 * @param {Context} ctx 
 */
function azarHelp(ctx){

    let mensajeHelp = "Sintaxis comando /azar :\n\n"
    mensajeHelp += "👉 /azar       - Azar con 🎲 [1-5]\n"
    mensajeHelp += "👉 /azar 5    - Azar emoji random [1-5]\n"
    mensajeHelp += "👉 /azar 6    - Azar emoji random [1-6]\n"
    mensajeHelp += "👉 /azar 64  - Azar emoji 🎰 [1-64]\n"

    ctx.reply(mensajeHelp)   
}

/**
 * 
 * @param {Context} ctx 
 */
export async function azar ( ctx, help ) {

    if (help) {
        azarHelp(ctx)
        return 
    }

    let emojis = []
    let mensaje = ""

    switch (ctx.args[0]) {
        case '5':
            emojis = ["🏀", "⚽"]
            mensaje = "Anotaste un"
            break;
        case '6':
            emojis = ["🎲", "🎯", "🎳"]
            mensaje = "Anotaste un"
            break;
        case '64':
            emojis = ["🎰"]
            mensaje = ""
        break;
        default:
            emojis = ["🎲"]
            mensaje = "Te salió un"
            break;
    }

    const emoji = emojis[Math.floor(Math.random() * emojis.length)]

    const { dice } = await ctx.replyWithDice({emoji})

    await ctx.replyWithMarkdownV2(`|| ${emoji} ${mensaje} ${dice.value}||`)
}
