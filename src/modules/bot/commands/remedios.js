import moment from "moment";
import { Medicamento } from "../../../database/classes/Medicamento.js";
import { ConsumoMedicamento } from "../../../database/classes/ComandoMedicamento.js";
import { obtenerDestinatariosCron } from "../cron-manager.js";


async function sincronizarMedicamentos(consumo_medicamento_id, medicamento_id, stock, dosis_diaria, user_at){

    const medicamento = new Medicamento()

    medicamento.id      = medicamento_id
    medicamento.stock   = stock - dosis_diaria
    medicamento.user_at = user_at

    const act_stock = await medicamento.actualizarStock()
    
    if (act_stock && act_stock.affectedRows > 0) {
        const consumoMedicamento = new ConsumoMedicamento()

        consumoMedicamento.id           = consumo_medicamento_id
        consumoMedicamento.consumido    = dosis_diaria
        consumoMedicamento.respaldo     = stock
        consumoMedicamento.user_at      = user_at

        const act_sincro = await consumoMedicamento.actualizarSincronizacion()

        if (act_sincro && act_sincro.affectedRows > 0) {

            if (dosis_diaria && dosis_diaria > 0 ) {
                return medicamento.stock / dosis_diaria
            } else {
                return medicamento.stock
            }
        }
    }

    return null;
}

async function ejecutarProcesoConsumoMedicamentos(ahora, user_at) {
    const medicamentos = new Medicamento()

    const medicamentos_vigentes = await medicamentos.obtenerMedicamentosVigentes()

    for (const medic_vig of medicamentos_vigentes) {
        const consumoMedicamento = new ConsumoMedicamento()
        consumoMedicamento.medicamento_id = medic_vig.ID
        consumoMedicamento.fecha_consumo = ahora.format('YYYY-MM-DD')

        const reglas_consumo = await consumoMedicamento.obtenerReglaMedicamento()
        
        if (reglas_consumo.length > 0 && reglas_consumo[0].SINCRONIZADO == 0) {

            const {ID, MEDICAMENTO_ID, STOCK, DOSIS_DIARIA} = reglas_consumo[0]
            
            await sincronizarMedicamentos(ID, MEDICAMENTO_ID, STOCK, DOSIS_DIARIA, user_at)
        }
    }
}



function notificarResumen(ahora, ctx, esCron){

    const medicamentos_vigentes = new Medicamento()


    medicamentos_vigentes.obtenerMedicamentosVigentes()
    .then(async medics_vig => {

        let mensaje_general = ''
        let mensaje_advertencia = ''

        for (const m of medics_vig) {
            const advetencia =  m.STOCK <= 7
            
            if ((esCron && !advetencia)) continue

            if (advetencia)  m.NOMBRE += ' 🔴'

            let fecha_sin_stock = ahora.add(m.STOCK, 'days')
    
            let mensaje = ''

            mensaje += `💊 ${m.NOMBRE}\n`
            mensaje += `    > Stock Disponible: ${m.STOCK}\n`
            mensaje += `    > Fecha sin Stock: ${moment(fecha_sin_stock).format("dddd DD [de] MMM")}\n\n`

            if (advetencia) {
                mensaje_advertencia += mensaje
            }
            mensaje_general += mensaje
        }

        if (!esCron) {
            if (mensaje_general) {
                ctx.reply(mensaje_general)
            } else {
                ctx.reply(`No se encontraron registros`)
            }
        } else if (mensaje_advertencia) {
            const destinatarios = await obtenerDestinatariosCron(8, esCron)
    
            destinatarios.forEach(destinatario => {             
                global.G_bot.telegram.sendMessage(destinatario.USUARIO_ID, mensaje_advertencia)
            });
        }
    })
}


export async function remedios(ctx, esCron = false){
    const { id, first_name, username, is_bot } = ctx.from
    
    const ahora = moment()

    await ejecutarProcesoConsumoMedicamentos(ahora, id)

    notificarResumen(ahora, ctx, esCron)
}