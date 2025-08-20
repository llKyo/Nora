import axios from "axios"
import { obtenerIpPublica } from "../helpers/ip.helpers.js"

export function dns(ctx, esCron = false){

    const TOKEN_DNS     = process.env.TOKEN_DNS
    const DOMAIN_DNS    = process.env.DOMAIN_DNS
    const URL_DNS       = process.env.URL_DNS

    const url = `https://www.duckdns.org/update?domains=${DOMAIN_DNS}&token=${TOKEN_DNS}&ip=`

    axios.get(url).then(async resp => {
        await ctx.reply('👍')
        await ctx.reply(resp.data)        
        await ctx.reply(URL_DNS)

        const ip = await obtenerIpPublica()
        await ctx.reply(`🛜 Ip Pública es: ${ip}`)
    }).catch(async error => {
        await ctx.reply('❗')
        await ctx.reply(error)

        const ip = await obtenerIpPublica()
        await ctx.reply(` Ip Pblica es: ${ip}`)
        
    })
}
