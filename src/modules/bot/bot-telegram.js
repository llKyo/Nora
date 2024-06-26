import { Telegraf } from "telegraf";

import * as cmd from "./commands/index.js"


export async function iniciarBot(){

    const bot = new Telegraf(process.env.BOT_TOKEN)

    bot.command("start", (ctx) => cmd.start(bot, ctx))

    bot.launch()

    console.log("DONE! 🐤\n") 
}