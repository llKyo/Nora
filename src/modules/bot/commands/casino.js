import axios from "axios"
import jsdom from "jsdom"
import { MinutaCasino } from "../../../database/classes/MinutaCasino.js"
import { Context } from "telegraf"

/**
 * 
 * @param {Context} ctx 
 * @param {boolean} esCron 
 * @returns 
 */
async function obtenerMinuta(ctx, esCron) {
    return new Promise((resolve, reject) => {
        axios.get(G_minuta_url).then(res => {
            const dom = new jsdom.JSDOM(res.data)

            let divCasaCentral = dom.window.document.querySelector("#casacentral")

            if (divCasaCentral.getElementsByTagName("*").length != 0) {

                divCasaCentral = new jsdom.JSDOM(divCasaCentral.innerHTML)

                const minutaCasino = new MinutaCasino()

                minutaCasino.periodo    = divCasaCentral.window.document.querySelector(".et_pb_blurb_description").firstElementChild.innerHTML
                minutaCasino.url        = divCasaCentral.window.document.querySelector("a").href
                minutaCasino.r_usuario  = ctx.from.id
                
                resolve(minutaCasino)
            } else {
                resolve(false)
            }
        }).catch(async err => {   
            if (!esCron) {
                await ctx.reply('😥')
                await ctx.reply('⚠️ Se produjo un error al buscar la minuta ')
            } else {
                //TODO: ENVIAR ERROR AL MASTER
            }
        })

    })
}

function generarRespuesta(minutaCasino, esNuevo){
    let msjRespuesta = ''

    if (esNuevo) msjRespuesta += "[Nuevo] "

    msjRespuesta += `${minutaCasino.periodo}\n\n`
    msjRespuesta += `🌱 Anexos Vegane de 10 a 11 Hrs:`
    msjRespuesta += `\n    ☎️ 3084`;
    msjRespuesta += `\n    ☎️ 3085`;
    msjRespuesta += `\n\n${minutaCasino.url}`;

    return msjRespuesta
}

export async function casino (ctx, esCron = false){

    if (!esCron) ctx.reply("Cazuelanding... ⌛")

    const minutaCasino = await obtenerMinuta(ctx, esCron)
   
    if (minutaCasino) {

        const esNuevo = await minutaCasino.registrarSiNoExiste()

        const msjRespuesta = generarRespuesta(minutaCasino, esNuevo)

        ctx.reply(msjRespuesta)
    }
}