import axios from "axios";
import { Context } from "telegraf";
import { IpZoom } from "../../../database/classes/IpZoom.js";

function compararIps(ipZoomVigentes, ipZoomEncontradas){

    const iPsVigentesNoEnc = ipZoomVigentes.filter((ipVigentes) => {
        const encontrado = ipZoomEncontradas.find((ipPublicadas) => ipVigentes == ipPublicadas)
        if (encontrado === undefined) return ipVigentes
    })

    const iPsPublicadasNoEnc = ipZoomEncontradas.filter((ipPublicadas) => {
        const encontrado = ipZoomVigentes.find((ipVigentes) => ipVigentes == ipPublicadas)

        if (encontrado === undefined) return ipPublicadas
    })

    return {iPsVigentesNoEnc, iPsPublicadasNoEnc}
}

/**
 * 
 * @param {Context} ctx 
 * @returns 
 */
function buscarIpsPublicadas(ctx) {
    return new Promise(async (resolve, reject) => {
        axios.get(G_IP_ZOOM_url)
            .then(res => {
                let respuesta = res.data

                const rgxTop = /## IP address.*/g
                const rgxBot = /(.*)The Zoom Webhook/g
                const rgxSlice = /```(.*)```/g

                respuesta = rgxTop.exec(respuesta)[0]
                respuesta = rgxBot.exec(respuesta)[0]
                respuesta = rgxSlice.exec(respuesta)[0]

                let ipsEncontradas = respuesta.split("\\n")

                ipsEncontradas = ipsEncontradas.filter((e) => e != "```")
                ipsEncontradas = ipsEncontradas.map((e) => e.trim())

                resolve(ipsEncontradas)
            })
            .catch(err => ctx.reply("⚠️\nHa ocurrido un error al buscar las IPs publicadas por ZOOM."))
    })
}

function generarMensajeResultado(iPsRespaldoNoEnc, iPsPublicadasNoEnc){
    let mensaje = "Resultado IPs Zoom:\n"

    if (iPsRespaldoNoEnc.length != 0) {
        mensaje += "\n⚠️ - Se encontraron IPs que ya no son válidas:"

        iPsRespaldoNoEnc.forEach((ip) => mensaje += `\n${ip}`)
    } else {
        mensaje += "\n✅ - Todas las IPs del Respaldo siguen vigentes"
    }

    if (iPsPublicadasNoEnc.length != 0) {
        mensaje += "\n⚠️ - Se encontraron IPs que ya no son válidas:"
        
        iPsPublicadasNoEnc.forEach((ip) => mensaje += `\n${ip}`)
    } else {
        mensaje += "\n✅ - No se encontraron IPs nuevas"
    }

    mensaje += "\n\n" + G_IP_ZOOM_url

    return mensaje
}

/**
 * 
 * @param {Context} ctx 
 */
export async function zoom(ctx) {

    const ipZoom = new IpZoom()
    
    let ipZoomVigentes = await ipZoom.consultarIpsVigentes()
    ipZoomVigentes = ipZoomVigentes.map(ipZoom => ipZoom.IP)

    const ipEncontradas = await buscarIpsPublicadas(ctx)

    const {iPsVigentesNoEnc, iPsPublicadasNoEnc} = compararIps(ipZoomVigentes, ipEncontradas)

    const mensaje = generarMensajeResultado(iPsVigentesNoEnc, iPsPublicadasNoEnc)

    ctx.reply(mensaje)
}