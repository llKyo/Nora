import { Scenes } from 'telegraf';
import { enviarListadoAdeudadoIndividual } from '../commands/adeudado.js';

let slcNomina = ''
let sTipoNomina = ''

function obtenerOpcion(ctx){
    let opcion = ctx.message.text.trim().match(/\/(\d+)_/)
    
    opcion = opcion ? opcion[1] : ctx.message.text.trim()

    return opcion
}

const deudaScene = new Scenes.WizardScene('deudaScene',

    // PASO 1: MOSTRAR TIPOS DE NOMINA ADEUDADO
    async (ctx) => {
        slcNomina = ''
        sTipoNomina = ''

        slcNomina = '💠 Selecciona tipo de nómina:\n'

        sTipoNomina += `\n/1_Mes_Actual`
        sTipoNomina += `\n/2_Completa`
        
        slcNomina += sTipoNomina

        ctx.reply(slcNomina);
        return ctx.wizard.next();
        },
        //PASO 2
        async (ctx) => {
            let opcion = obtenerOpcion(ctx)
    
            if (opcion == '*') {
                ctx.reply('❌ Proceso detenido.');
                ctx.scene.leave()
                return
            }

            if (opcion != "1" && opcion != "2") {
                await ctx.reply('❌ Opción invalida');
                await ctx.reply(slcNomina);
                return
            }
    
            switch (opcion) {
                case '1':
                    if (! await enviarListadoAdeudadoIndividual(1, ctx.session.id_adeudado)) {
                        await ctx.reply(`💠 - No se han encontrado deudas.`)
                        await ctx.reply(`🥳`)
                    }
                    ctx.scene.leave()
                    break;
                case '2':
                    if (! await enviarListadoAdeudadoIndividual(2, ctx.session.id_adeudado) ) {
                        await ctx.reply(`💠 - No se han encontrado deudas.`)
                        await ctx.reply(`🥳`)
                    }
                    ctx.scene.leave()
                    break;
            }
        },
)

export default deudaScene;