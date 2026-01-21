import { Scenes, session, Telegraf } from "telegraf";
import { iniciarComando } from "./command-manager.js";
import { cargarCrons } from "./cron-manager.js";
import cargaGastosScene from "./scenes/carga-gastos.scene.js";
import testScene from "./scenes/test.scene.js";
import cargaGastoCorriente from "./scenes/carga-g-corriente.scene.js";
import deudaScene from "./scenes/deuda.scene.js";

export async function iniciarBot(){

    const bot = new Telegraf(process.env.BOT_TOKEN)

    const stage = new Scenes.Stage([cargaGastosScene, testScene, cargaGastoCorriente, deudaScene]);

    bot.use(session()); // Activar soporte de sesión
    bot.use(stage.middleware()); // Activar soporte de escenas

    bot.command("start", iniciarComando)
    bot.command("casino", iniciarComando)
    bot.command("feriados", iniciarComando)
    bot.command("azar", iniciarComando)
    bot.command("loto", iniciarComando)
    bot.command("zoom", iniciarComando)
    bot.command("remedios", iniciarComando)
    bot.command("ip", iniciarComando)
    bot.command("timesheet", iniciarComando)
    bot.command("mpa", iniciarComando)
    bot.command("dns", iniciarComando)
    bot.command("gastos", iniciarComando)
    bot.command("corriente", iniciarComando)
    bot.command("hoy", iniciarComando)
    bot.command("resumen", iniciarComando)
    bot.command("adeudado", iniciarComando)
    

    bot.command("help", iniciarComando)

    bot.command("test", ctx => {
       
    })

    global.G_bot = bot

    await cargarCrons()

    bot.launch()

    console.log("DONE! 🐤\n") 
}