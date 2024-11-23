import puppeteer from 'puppeteer';
import jsdom from "jsdom"
import moment from 'moment';
import { Loto } from '../../../database/classes/Loto.js';
import { Context } from 'telegraf';
import { obtenerDestinatariosCron } from '../cron-manager.js';
import { imprimirRespuesta } from '../log.js';

async function buscarInfoLotter()
{
    const browser = await puppeteer.launch({ 
        headless: true
        // , args: ['--no-sandbox', '--disable-setuid-sandbox'] 
        , executablePath: process.env.PATH_BROWSER
    });
    const page = await browser.newPage();

    await page.goto(G_LOTERIA_url);
    await page.waitForFunction('window.performance.timing.loadEventEnd - window.performance.timing.navigationStart >= 500');

    const pageSourceHTML = await page.content();

    await browser.close();

    const dom = new jsdom.JSDOM(pageSourceHTML)

    let spanPrize = dom.window.document.querySelector(".prize")
    let prize = spanPrize.innerHTML

    return prize
}

/**
 * 
 * @param {Context} ctx 
 */
export async function loto(ctx, esCron = false){

    if(!esCron) ctx.reply("Consultando...")

    buscarInfoLotter()
        .then(async prize => {
            prize = prize.replace("$", "") 

            let mensaje = `Se encontró el siguiente monto:\n💲${prize}`
            mensaje += `\n\n${G_LOTERIA_url}`

            const loto = new Loto()
            loto.fecha      = moment().format('YYYY-MM-DD')
            loto.monto      = prize.replace(".", "") 
            loto.user_at  = ctx.chat.id 

            loto.registrar()

            if (!esCron) {
                await ctx.reply("💫")
                await ctx.reply(mensaje)        
            } else {
                const destinatarios = await obtenerDestinatariosCron(6, esCron)

                destinatarios.forEach(destinatario => {
                    global.G_bot.telegram.sendMessage(destinatario.ID_USUARIO, mensaje)
                });
            }
            
        })
        .catch(err => {
            if (!esCron) ctx.reply("Se produjo un error")
            console.log(err);
        })

}
