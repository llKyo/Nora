import moment from "moment"

export function configurar(){
    //PROCESS
    process.env.ROOT_PATH = process.cwd()

    //GLOBALS
    global.G_print_query    = process.env.PRINT_QUERY === 'true'
    global.G_validar_acceso = process.env.VALIDAR_ACESO === 'true'
    global.G_genera_usuario = process.env.GENERA_USUARIO === 'true'

    //RUTAS
    global.G_minuta_url     = "https://vrafpucv.cl/casino/#casacentral"
    global.G_feriados_url   = "https://apis.digital.gob.cl/fl/feriados/"
    global.G_IP_ZOOM_url    = "https://developers.zoom.us/docs/api/rest/webhook-reference/"
    global.G_LOTERIA_url    = "https://www.polla.cl/es/"

    //LOCALE
    moment.locale("es-mx")
}