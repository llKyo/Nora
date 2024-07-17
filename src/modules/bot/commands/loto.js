import puppeteer from 'puppeteer';
import jsdom from "jsdom"
import moment from 'moment';
import { Loto } from '../../../database/classes/Loto.js';
import { Context } from 'telegraf';

async function buscarInfoLotter()
{
    const browser = await puppeteer.launch({headless: 'new'});
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
export async function loto(ctx){

    ctx.reply("Consultando...")

    buscarInfoLotter()
        .then(async prize => {
            prize = prize.replace("$", "") 

            let mensaje = `Se encontró el siguiente monto:\n💲${prize}`

            const loto = new Loto()
            loto.fecha      = moment().format('YYYY-MM-DD')
            loto.monto      = prize.replace(".", "") 
            loto.r_usuario  = ctx.chat.id 

            loto.registrar()

            await ctx.reply("💫")
            await ctx.reply(mensaje)
        })
        .catch(err => ctx.reply("Se produjo un error"))

}
