import { Gasto } from "../../../database/classes/Gasto.js";

const formatoCLP = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP"
});

export async function adeudado ( ctx, help ) {

    const gasto = new Gasto()

    const adeudados = await gasto.consultarAdeudados()

    let msj_adeudados = "DESCRIPCIÓN                      *   MONTO\n";
    msj_adeudados += "------------------------------  ---  -----------\n";

    adeudados.forEach(adeuda => {
        const descripcion = adeuda.DESCRIPCION.replace("Abono ", "")
        const monto = formatoCLP.format(adeuda.MONTO)
	const adeudado = adeuda.ADEUDADO

        msj_adeudados += `${descripcion.padEnd(30)}  ${adeudado.padEnd(4)}  ${monto.padStart(10)}\n`;
    });

    global.G_bot.telegram.sendMessage(process.env.USER_MASTER, `\`\`\`\n${msj_adeudados}\n\`\`\``, {
        parse_mode: "Markdown"
    });
}