import * as cmd from "./commands/index.js"

import { generarLog } from "./log.js"


export function iniciarComando(ctx, bot, comando){

    generarLog(ctx)

    switch (comando) {
        case "start":
            cmd.start(bot, ctx)
            break;
    
        default:
            break;
    }
}