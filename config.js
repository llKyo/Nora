import moment from "moment"

export function configurar(){
    //PROCESS
    process.env.ROOT_PATH = process.cwd()

    //GLOBALS
    global.G_print_query = false

    //LOCALE
    moment.locale("es-mx")
}