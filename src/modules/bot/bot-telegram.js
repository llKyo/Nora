import { Telegraf } from "telegraf";
import { iniciarComando } from "./command-manager.js";

export async function iniciarBot(){

    const bot = new Telegraf(process.env.BOT_TOKEN)

    bot.command("start", (ctx) => iniciarComando(ctx, bot, "start"))

    bot.launch()

    console.log("DONE! 🐤\n") 
}