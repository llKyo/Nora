import axios from "axios"

export function dns(ctx, esCron = false){

    const TOKEN_DNS     = process.env.TOKEN_DNS
    const DOMAIN_DNS    = process.env.DOMAIN_DNS
    const URL_DNS       = process.env.URL_DNS

    const url = `https://www.duckdns.org/update?domains=${DOMAIN_DNS}&token=${TOKEN_DNS}&ip=`

    axios.get(url).then(async resp => {
        await ctx.reply('👍')
        await ctx.reply(resp.data)
        await ctx.reply(URL_DNS)
    }).catch(async error => {
        await ctx.reply('❗')
        await ctx.reply(error)
        
    })
}