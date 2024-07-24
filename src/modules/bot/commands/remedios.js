import moment from "moment";
import { Medicamento } from "../../../database/classes/Medicamento.js";
import { obtenerDestinatariosCron } from "../cron-manager.js";


function calcularPorcentaje(montoMenor, montoMayor, formateado = true) {
    let resultado = 100 - ((montoMayor / montoMenor) * 100)

    resultado = resultado.toFixed(2)

    if (formateado) {
        resultado = resultado + '%'
    }

    return resultado
}

async function obtenerResumenMedicamentos() {
    const medicamento = new Medicamento();

    const remComprados  = await medicamento.obtenerMedicCompradosVigentes()
    // const remConsumAcum = await medicamento.obtenerMedicConsumAcum()
    const remConsumidos = await medicamento.obtenerMedicConsumidos()
    
    let resumenCompleto = []

    remComprados.forEach(remCom => {
        remConsumidos.forEach(remConsum => {
            if (remCom.ID == remConsum.ID) {
                const resumenMedic = {}
                resumenMedic.id = remCom.ID
                resumenMedic.nombre = remCom.NOMBRE
                resumenMedic.comprado = remCom.COMPRADO
                resumenMedic.dosis_diaria = remCom.DOSIS_DIARIA
                resumenMedic.consumido = remConsum.CONSUMIDO
                resumenMedic.stock = remCom.COMPRADO - remConsum.CONSUMIDO
                resumenMedic.porcentaje = calcularPorcentaje(remCom.COMPRADO, remConsum.CONSUMIDO)
                resumenMedic.porcentaje_valor = parseFloat(calcularPorcentaje(remCom.COMPRADO, remConsum.CONSUMIDO, false))
                resumenMedic.dias_faltantes = Math.trunc(resumenMedic.stock / resumenMedic.dosis_diaria)

                resumenMedic.fechaSinStock = moment().add(resumenMedic.dias_faltantes,'days').format("YYYY-MM-DD");

                resumenCompleto.push(resumenMedic)
            }
        })
    });
    
    return resumenCompleto
}

export function remedios(ctx, esCron = false){
    obtenerResumenMedicamentos()
        .then(resumen => {
            resumen.map(async r => {

                let porcentaje_format = r.porcentaje
                let stock_format = r.stock

                let nivel_critico = 0

                if (r.porcentaje_valor < 40) {
                    porcentaje_format += ' ⚠️'
                    nivel_critico++
                }
                if (r.dias_faltantes <= 7 ) {
                    stock_format += ' 🔴'
                    nivel_critico++
                }

                let mensaje = ''
                mensaje += `💊 ${r.nombre}\n`
                mensaje += `    > Stock Disponible: ${stock_format}\n`
                mensaje += `    > Porcentaje: ${porcentaje_format}\n`
                mensaje += `    > Fecha sin Stock: ${r.fechaSinStock}\n`
                
                if (!esCron) {
                    ctx.reply(mensaje)
                } else if (nivel_critico > 0) {
                    const destinatarios = await obtenerDestinatariosCron('/remedios', esCron)

                    destinatarios.forEach(destinatario => {
                        global.G_bot.telegram.sendMessage(destinatario.ID_USUARIO, mensaje)
                    });
                }
            })
        })
    
    // ctx.reply(resumen.nombre)
}