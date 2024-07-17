import { Telegraf } from "telegraf";
import { iniciarComando } from "./command-manager.js";

export async function iniciarBot(){

    const bot = new Telegraf(process.env.BOT_TOKEN)

    bot.command("start", iniciarComando)
    bot.command("casino", iniciarComando)
    bot.command("feriados", iniciarComando)
    bot.command("azar", iniciarComando)
    bot.command("loto", iniciarComando)
    bot.command("zoom", iniciarComando)
    
    bot.command("help", iniciarComando)

    global.G_bot = bot

    bot.launch()

    console.log("DONE! 🐤\n") 
}