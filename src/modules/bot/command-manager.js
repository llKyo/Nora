import * as cmd from "./commands/index.js"

import { generarLog } from "./log.js"


export function iniciarComando(ctx, comando){

    generarLog(ctx)

    switch (comando) {
        case "start":
            cmd.start(ctx)
            break;
        case "casino":
            cmd.casino(ctx)
            break;
        default:
            break;
    }
}