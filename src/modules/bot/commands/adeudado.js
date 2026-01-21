import { Gasto } from "../../../database/classes/Gasto.js";
import { Usuario } from "../../../database/classes/Usuario.js";

const formatoCLP = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP"
});

function partirTextoPorPalabras(texto, ancho) {
    const palabras = texto.split(" ");
    const lineas = [];
    let lineaActual = "";

    for (const palabra of palabras) {
        if ((lineaActual + palabra).length <= ancho) {
            lineaActual += (lineaActual ? " " : "") + palabra;
        } else {
            lineas.push(lineaActual);
            lineaActual = palabra;
        }
    }

    if (lineaActual) {
        lineas.push(lineaActual);
    }

    return lineas;
}

async function enviarListadoAdeudadosCompleto(tipo_nomina){
    
    const gasto = new Gasto();

    let adeudados = []

    switch (tipo_nomina) {
        case 1:
            adeudados = await gasto.consultarAdeudadosMesActual();
            break;
        case 2:
            adeudados = await gasto.consultarAdeudadosCompleta();
            break;
    }

    if (adeudados.length == 0) {
        return false
    }

    const ANCHO_ADEUD = 3;
    const ANCHO_DESC  = 25;
    const ANCHO_MONTO = 11;

    const bar_adeud = "-".repeat(ANCHO_ADEUD);
    const bar_desc  = "-".repeat(ANCHO_DESC);
    const bar_monto = "-".repeat(ANCHO_MONTO);

    const title_adeud = "*"
    const title_desc  = "DESCRIPCIÓN"
    const title_monto = "MONTO"

     let msj_adeudados = `${title_desc.padEnd(ANCHO_DESC)}  `;
    msj_adeudados += ` ${title_adeud}   `;
    msj_adeudados += `${title_monto.padEnd(ANCHO_MONTO)}\n`;
    msj_adeudados += `${bar_desc}  ${bar_adeud}  ${bar_monto}\n`;

    adeudados.forEach(adeuda => {

        const descripcionCompleta = adeuda.DESCRIPCION.replace("Abono ", "");
        const monto = formatoCLP.format(adeuda.MONTO * -1);
        const adeudado =  " " + adeuda.ADEUDADO

        const lineasDescripcion = partirTextoPorPalabras(
            descripcionCompleta,
            ANCHO_DESC - 1
        );

        msj_adeudados +=
            `${lineasDescripcion[0].padEnd(ANCHO_DESC)}  ` +
            `${adeudado.padEnd(4)}  ` +
            `${monto.padStart(10)}\n`;

        for (let i = 1; i < lineasDescripcion.length; i++) {
            msj_adeudados +=
                `${lineasDescripcion[i].padEnd(ANCHO_DESC)}\n`;
        }
    });

    global.G_bot.telegram.sendMessage(
        process.env.USER_MASTER,
        `\`\`\`\n${msj_adeudados}\n\`\`\``,
        { parse_mode: "Markdown" }
    );

    return true
}

export async function enviarListadoAdeudadoIndividual(tipo_nomina, id_adeudado){

    const gasto = new Gasto();

    let adeudados_completa = []

    switch (tipo_nomina) {
        case 1:
            adeudados_completa = await gasto.consultarAdeudadosMesActual();
            break;
        case 2:
            adeudados_completa = await gasto.consultarAdeudadosCompleta();
            break;
    
        default:
            break;
    }

    const adeudados = adeudados_completa.filter(a => a.ADEUDADO === id_adeudado)

    if (adeudados.length == 0) {
        return false
    }

    const ANCHO_FECHA = 10;
    const ANCHO_DESC  = 18;
    const ANCHO_MONTO = 11;

    const bar_fecha = "-".repeat(ANCHO_FECHA);
    const bar_desc  = "-".repeat(ANCHO_DESC);
    const bar_monto = "-".repeat(ANCHO_MONTO);

    const title_fecha = "FECHA"
    const title_desc  = "DESCRIPCIÓN"
    const title_monto = "MONTO"

    let msj_adeudados = `${title_fecha.padEnd(ANCHO_FECHA)}  `;
    msj_adeudados += `${title_desc.padEnd(ANCHO_DESC)}  `;
    msj_adeudados += `${title_monto.padEnd(ANCHO_MONTO)}\n`;
    msj_adeudados += `${bar_fecha}  ${bar_desc}  ${bar_monto}\n`;


    adeudados.forEach(adeuda => {

        const descripcionCompleta = adeuda.DESCRIPCION.replace("Abono ", "");

        const fecha_iso = adeuda.FECHA.toISOString()

        const [anio, mes, dia] = fecha_iso.split("T")[0].split("-");

        const fecha = `${dia}/${mes}/${anio}`;

        const monto = formatoCLP.format(adeuda.MONTO * -1);
        const adeudado =  " " + adeuda.ADEUDADO

        const lineasDescripcion = partirTextoPorPalabras(
            descripcionCompleta,
            ANCHO_DESC - 1
        );

        const espacios = " ".repeat(11);

        msj_adeudados +=
            `${fecha}  ` +
            `${lineasDescripcion[0].padEnd(ANCHO_DESC)}  ` +
            `${monto.padStart(10)}\n`;

        for (let i = 1; i < lineasDescripcion.length; i++) {
            msj_adeudados +=
                `${espacios} ${lineasDescripcion[i].padEnd(ANCHO_DESC)}\n`;
        }
    });

    global.G_bot.telegram.sendMessage(
        process.env.USER_MASTER,
        `\`\`\`\n${msj_adeudados}\n\`\`\``,
        { parse_mode: "Markdown" }
    );

    return true
}

export async function adeudado(ctx, help) {

    const usuario = new Usuario()
    usuario.id = ctx.from.id 

    let deudor = await usuario.consultar()

    if (deudor.length == 0) {
        ctx.reply(`⚠️ - Usuario no registrado.`)
        return 
    }

    if ( !deudor[0].OWES && !deudor[0].IS_MASTER) {
        ctx.reply(`⚠️ - Simbolo identificado de deuda no definido.`)
        return 
    } 

    if (deudor[0].IS_MASTER) {
        if (ctx.payload == 'completo' || ctx.payload == '1') {
            if (! await enviarListadoAdeudadosCompleto(2)) {
                await ctx.reply(`💠 - No se han encontrado dedudas.`)
                await ctx.reply(`🥳`)
            }
        } else {
            if (! await enviarListadoAdeudadosCompleto(1)) {
                await ctx.reply(`💠 - No se han encontrado dedudas.`)
                await ctx.reply(`🥳`)
            }
        }
        
        return
    }


    ctx.session.id_adeudado = deudor[0].OWES

    ctx.session = { __scenes: ctx.session.__scenes || {} };
    
    ctx.scene.enter('deudaScene')

}