import moment from "moment"

export function configurar(){
    //PROCESS
    process.env.ROOT_PATH = process.cwd()

    //GLOBALS
    global.G_print_query = process.env.PRINT_QUERY === 'true'

    global.G_minuta_url = "https://vrafpucv.cl/casino/#casacentral"

    //LOCALE
    moment.locale("es-mx")
}