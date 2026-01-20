const formatoCLP = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP"
});

export async function adeudado ( ctx, help ) {

    const gasto = new Gasto()

    adeudados = gasto.consultarAdeudados()

    let msj_adeudados = "DESCRIPCIÓN           MONTO\n";
    msj_adeudados += "--------------------  ----------\n";

    adeudados.forEach(adeuda => {
        const descripcion = adeuda.DESCRIPCION.replace("Abono ", "")
        const monto = formatoCLP.format(adeuda.MONTO)

        msj_adeudados += `${descripcion.padEnd(20)}  ${monto.padStart(10)}\n`;
    });

    bot.sendMessage(process.env.USER_MASTER, `\`\`\`\n${msj_adeudados}\n\`\`\``, {
        parse_mode: "Markdown"
    });
}