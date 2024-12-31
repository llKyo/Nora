import { Scenes, session, Telegraf } from "telegraf";
import { iniciarComando } from "./command-manager.js";
import { cargarCrons } from "./cron-manager.js";
import { BaseScene, Stage } from "telegraf/scenes";

export async function iniciarBot(){

    const bot = new Telegraf(process.env.BOT_TOKEN)

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
    
    bot.command("test", iniciarComando)
    
    bot.command("help", iniciarComando)

    // Crear escena para preguntar el nombre
    const nameScene = new BaseScene('nameScene');

    nameScene.enter((ctx) => ctx.reply('¿Cómo te llamas?'));
    nameScene.on('text', (ctx) => {
    ctx.session.name = ctx.message.text; // Guardar el nombre en la sesión
    ctx.reply(`Gracias, ${ctx.session.name}. ¿Cuántos años tienes?`);
    ctx.scene.enter('ageScene'); // Pasar a la siguiente escena
    });

    // Crear escena para preguntar la edad
    const ageScene = new BaseScene('ageScene');

    ageScene.on('text', (ctx) => {
    const age = parseInt(ctx.message.text, 10);
    if (isNaN(age)) {
        ctx.reply('Por favor, ingresa un número válido para la edad.');
    } else {
        ctx.session.age = age; // Guardar la edad en la sesión
        ctx.reply(`¡Gracias por la información, ${ctx.session.name} de ${ctx.session.age} años!`);
        ctx.scene.leave(); // Salir del flujo de escenas
    }
    });

    const stage = new Scenes.Stage([nameScene, ageScene]);

    bot.use(session()); // Activar soporte de sesión
    bot.use(stage.middleware()); // Activar soporte de escenas

    bot.command('escena', (ctx) => {
        ctx.reply('¡Hola! Vamos a iniciar una conversación.');
        ctx.scene.enter('nameScene'); // Iniciar la escena desde el principio
    });

    global.G_bot = bot

    await cargarCrons()

    bot.launch()

    console.log("DONE! 🐤\n") 
}