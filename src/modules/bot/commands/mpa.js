import { JSDOM } from "jsdom";
import puppeteer from "puppeteer";

function buscarEnIndex() {
    return new Promise(async (resolve, reject) => {
        const browser = await puppeteer.launch({ 
            headless: true
            // , args: ['--no-sandbox', '--disable-setuid-sandbox'] 
            , executablePath: process.env.PATH_BROWSER
        });
        const page = await browser.newPage();
    
        await page.goto(G_MPA_url);
        await page.waitForFunction('window.performance.timing.loadEventEnd - window.performance.timing.navigationStart >= 500');
    
        const pageSourceHTML = await page.content();
    
        await browser.close();
    
        const dom = new JSDOM(pageSourceHTML)
        
        const btnIngresar = dom.window.document.querySelector("#btn_ingresar")

        if (btnIngresar.value === 'Ingresar') {
            resolve('MPA Sigue Vivo')
        } else {
            reject('No se encontró el botón Ingresar en MPA')
        }
    })
    
}

export function mpa(ctx, esCron = false) {

    if (!esCron) ctx.reply('🌎Verificando Web...\n' + G_MPA_url)

    buscarEnIndex()
    .then(async resp => {
        if (!esCron) {
            await ctx.reply(resp)
            await ctx.reply('👍')
        } 
    })
    .catch(async error => {
        if (!esCron) {
            await ctx.reply(error)
            await ctx.reply('💥')

            if (ctx.from.id != process.env.USER_MASTER) {
                await global.G_bot.telegram.sendMessage(process.env.USER_MASTER, error)
                await global.G_bot.telegram.sendMessage(process.env.USER_MASTER, '💥')

            }
        } else {
            await global.G_bot.telegram.sendMessage(process.env.USER_MASTER, error)
            await global.G_bot.telegram.sendMessage(process.env.USER_MASTER, '💥')
        }
    })
}