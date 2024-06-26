import { Telegraf } from "telegraf";

export async function iniciarBot(){

    const bot = new Telegraf(process.env.BOT_TOKEN)

    bot.command("start", (ctx) => ctx.reply('🖐️'))

    bot.launch()

    console.log("DONE! 🐤\n") 
}