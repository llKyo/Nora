import { Telegraf } from "telegraf";
import { iniciarComando } from "./command-manager.js";

export async function iniciarBot(){

    global.G_bot = new Telegraf(process.env.BOT_TOKEN)

    G_bot.command("start", (ctx) => iniciarComando(ctx, "start"))
    G_bot.command("casino", (ctx) => iniciarComando(ctx, "casino"))

    G_bot.launch()

    console.log("DONE! 🐤\n") 
}