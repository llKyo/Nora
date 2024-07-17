import axios from "axios";
import moment from "moment";
import { Context } from "telegraf";

function generarRespuesta(feriados, ahora){

    let msjRetorno = "Próximos Feriados: \n\n"
    feriados.forEach(f => {

        const fecha = moment(f.fecha)

        if (fecha > ahora) {
            
            const esIrrenunciable = f.irrenunciable == 1 ? "🚫" : ""
            const fechaFormatada = fecha.format("DD MMM").toUpperCase()
            const numDiaSemana = fecha.format("d")
            const diaSemana = fecha.format("dddd")
            const tipFeriado = f.tipo == "Religioso" ? "✝️" : "✳️"

            msjRetorno += tipFeriado + " "
            msjRetorno += fechaFormatada + " "
            msjRetorno += f.nombre + " "
            msjRetorno += esIrrenunciable + "\n"

            msjRetorno += "         "

            if (numDiaSemana == 6) {
                msjRetorno += "❌ " + diaSemana + " 😥"
            } else if (numDiaSemana == 0) {
                msjRetorno += "❌ " + diaSemana + " 😓"
            } else {
                msjRetorno += "✅ " + diaSemana
            }
            msjRetorno += "\n"
        }
    })

    msjRetorno += "\n✳️ Civil"
    msjRetorno += "\n✝️ Religioso"
    msjRetorno += "\n🚫 Irrenunciable"

    return msjRetorno
}

function obtenerFeriados(ano){
    return new Promise(async (resolve, reject) =>{
        axios.get(G_feriados_url + ano)
            .then(resp => {
                resolve(resp.data)
            })
            .catch(err => resolve(new Array()))
    })
}

/**
 * 
 * @param {Context} ctx 
 */
export async function feriados(ctx){
    const ahora = moment()

    const feriados = await obtenerFeriados(2024, ahora.format("YYYY"))

    ctx.reply(generarRespuesta(feriados, ahora))
}