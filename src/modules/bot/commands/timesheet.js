import puppeteer from "puppeteer";
import { obtenerDestinatariosCron } from "../cron-manager.js";

async function obtenerHorasSemanalesTimeSheet() {

    const browser = await puppeteer.launch({
        headless: true
        // , args: ['--no-sandbox', '--disable-setuid-sandbox'] 
        , executablePath: process.env.PATH_BROWSER
    });
    const page = await browser.newPage();

    await page.goto(process.env.PATH_TIMESHEET);
    await page.waitForFunction('window.performance.timing.loadEventEnd - window.performance.timing.navigationStart >= 500');

    await page.type('#iux-identifier-first-international-email-user-id-input', process.env.TS_USER);

    await page.click('[data-testid="IdentifierFirstSubmitButton"]');

    await page.waitForSelector('#iux-password-confirmation-password', { visible: true });

    await page.type('#iux-password-confirmation-password', process.env.TS_PASS);

    await page.click('[data-testid="passwordVerificationContinueButton"]');

    await page.waitForSelector('#timesheets_v2_shortcut', { visible: true });
    await page.click('#timesheets_v2_shortcut');

    await page.waitForSelector('.ts-jss-298', { visible: true });

    const horasSemanalesTotales = await page.$eval('.ts-jss-298', (element) => {
        return element.textContent; // Obtiene el texto del elemento
    });

    await browser.close();

    return horasSemanalesTotales
}


export async function timesheet(ctx, esCron = false) {

    if (!esCron){
        await ctx.reply('🤖')
        await ctx.reply('Revisando...')
    }

    obtenerHorasSemanalesTimeSheet()
        .then(async tiempoTotalSemanal => {
            const regex = /(\d+)h (\d+)m/;
            const tiempoRegex = tiempoTotalSemanal.match(regex);

            let mensaje = ``
            let bNotificar = false

            if (tiempoRegex) {
                const horas = parseInt(tiempoRegex[1], 10);
                const minutos = parseInt(tiempoRegex[2], 10);

                if (!esCron) {
                    mensaje += `Tiempo Ingresado en el Time💩\n\n`
                } else {
                    mensaje += `⚠️ - Faltan horas en el Time💩\n\n`
                    mensaje += `🕛 Horas Agendadas:\n`
                }
                mensaje += `${horas} ${horas == 1? "Hora" : "Horas"}\n`
                mensaje += `${minutos} ${minutos == 1? "Minuto" : "Minutos"}\n`


                if (horas < 40) {
                    bNotificar = true
                }

            } else {
                mensaje += `Tiempo Ingresado en el Time💩 no pudo ser formateado\n\n`
                mensaje += `Tiempo encontrado: ${tiempoTotalSemanal}\n`
            }

            mensaje += `\n🌐👉 ${ process.env.PATH_TIMESHEET }`

            if (!esCron) {
                await ctx.reply('⌛')
                await ctx.reply(mensaje)
            } else if (bNotificar) {
                const destinatarios = await obtenerDestinatariosCron(10, esCron)
    
                destinatarios.forEach(destinatario => {             
                    global.G_bot.telegram.sendMessage(destinatario.USUARIO_ID, mensaje)
                });
            }
            
        })
        .catch(async err => {
            await ctx.reply(`💥`)
            await ctx.reply(`Error Inesperado`)
            console.log(err);
            
        })

}