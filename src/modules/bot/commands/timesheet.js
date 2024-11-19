import puppeteer from "puppeteer";

async function abrirNavegador() {
    const browser = await puppeteer.launch({ 
        headless: true
        // , args: ['--no-sandbox', '--disable-setuid-sandbox'] 
        , executablePath: G_PATH_BROWSER
    });
    const page = await browser.newPage();

    await page.goto("https://www.google.cl");
    await page.waitForFunction('window.performance.timing.loadEventEnd - window.performance.timing.navigationStart >= 500');

    await browser.close();

}


export function timesheet(ctx, esCron = false) {
    
    ctx.reply('⭐')

    abrirNavegador()

    ctx.reply('🐤')

}