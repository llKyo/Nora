import { Scenes } from 'telegraf';
import { cargarGastoTransporteDB } from '../commands/corriente.js';

const aGastoTransComunes = [
    {ID:1,DESCRIPCION:"Colectivo",MONTO:900},
    {ID:2,DESCRIPCION:"Micro_Local",MONTO:400},
    {ID:3,DESCRIPCION:"Micro_Normal",MONTO:470},
    {ID:4,DESCRIPCION:"Micro_Directo",MONTO:560},
    {ID:5,DESCRIPCION:"Otros",MONTO:0},
]

const aGastoComComunes = [
    {ID:1,DESCRIPCION:"Pancito",MONTO:1190},
    {ID:2,DESCRIPCION:"Otros",MONTO:0},
]


const aCategorias = [
    {ID:1,DESCRIPCION:"Comida", T_CATEGORIA:2},
    {ID:2,DESCRIPCION:"Transporte", T_CATEGORIA:10},
]

let slcCategorias = ''
let mensajeMontoConfirm = ''
let slcTCategoria = ''

const cargaGastoCorriente = new Scenes.WizardScene('cargaGastoCorriente',
    (ctx) => {

        ctx.session.categoria = null
        ctx.session.tipo_gasto = null
        ctx.session.tipo_gasto_desc = null
        ctx.session.t_categoria = null
        ctx.session.t_categoria_desc = null
        ctx.session.monto = null

        slcTCategoria = '💠 Selecciona una categoria:'

        aCategorias.forEach(({DESCRIPCION}, i) => {
            slcTCategoria += `\n/${i + 1}_${DESCRIPCION}`
        });

        ctx.reply(slcTCategoria)


        ctx.wizard.next()
    },
    //PASO 1
    async (ctx) => {
        let opcion = ctx.message.text.trim().match(/\/(\d+)_/)
        opcion = opcion ? opcion[1] : ctx.message.text.trim()


        switch (opcion) {
            case '1':
                slcCategorias = '🍎 Selecciona una opción común:\n'

                aGastoComComunes.forEach(({DESCRIPCION, MONTO}, i) => {
                    slcCategorias += `\n/${i + 1}_${DESCRIPCION} - $${MONTO.toLocaleString('es-CL')}`
                });

                ctx.session.t_categoria = 2
                ctx.session.t_categoria_desc = 'Comida'

                break;
            case '2':
                slcCategorias = '🚗 Selecciona una opción común:\n'

                aGastoTransComunes.forEach(({DESCRIPCION, MONTO}, i) => {
                    slcCategorias += `\n/${i + 1}_${DESCRIPCION} - $${MONTO.toLocaleString('es-CL')}`
                });

                ctx.session.t_categoria = 10
                ctx.session.t_categoria_desc = 'Transporte'

                break;
            default:
                await ctx.reply('❌ Opción no válida.');
                await ctx.reply(slcTCategoria)

                return ;
        }
        
        ctx.reply(slcCategorias)
        ctx.wizard.next()
    },
    //PASO 2
    async (ctx) => {
        let opcion = ctx.message.text.trim().match(/\/(\d+)_/)
        opcion = opcion ? opcion[1] : ctx.message.text.trim()
        
        switch (ctx.session.t_categoria) {
            case 2:
                if (isNaN(opcion) || !aGastoComComunes.hasOwnProperty(opcion - 1)) {

                    await ctx.reply('❌ Opción no válida.');
                    await ctx.reply(slcCategorias);
                    return; 
                }
        
                ctx.session.categoria = opcion - 1;
                ctx.session.tipo_gasto = aGastoComComunes[opcion - 1].ID;
                ctx.session.tipo_gasto_desc = aGastoComComunes[opcion - 1].DESCRIPCION;
                ctx.session.monto = aGastoComComunes[opcion - 1].MONTO;
                break;
            case 10:
                if (isNaN(opcion) || !aGastoTransComunes.hasOwnProperty(opcion - 1)) {

                    await ctx.reply('❌ Opción no válida.');
                    await ctx.reply(slcCategorias);
                    return; 
                }
        
                ctx.session.categoria = opcion - 1;
                ctx.session.tipo_gasto = aGastoTransComunes[opcion - 1].ID;
                ctx.session.tipo_gasto_desc = aGastoTransComunes[opcion - 1].DESCRIPCION;
                ctx.session.monto = aGastoTransComunes[opcion - 1].MONTO;
                break;
        
            default:
                await ctx.reply('❌ Opción no válida.');
                await ctx.reply(slcCategorias);
                return; 
        }

        if (ctx.session.monto == 0) {
            ctx.reply('💰 Ingrese un monto:');
            ctx.wizard.next()
        } else {

            mensajeMontoConfirm = `🟡 Confirmación de la carga ${ctx.session.t_categoria_desc}:\n`
            mensajeMontoConfirm += `       Monto $${ctx.session.monto.toLocaleString('es-CL')}`
            mensajeMontoConfirm += `\n\n/1_Aceptar\n/2_Cancelar`
            ctx.reply(mensajeMontoConfirm);

            return ctx.wizard.selectStep(4);
        }
    },
    //PASO 3
    async (ctx) => {
        const monto = ctx.message.text.trim()

        if (isNaN(monto) || monto <= 0) {
            await ctx.reply('❌ Opción no válida.')
            await ctx.reply('💰 Ingrese un monto:');
            return 
        }

        ctx.session.monto = monto
        
        mensajeMontoConfirm = `🟡 Confirmación de la carga ${ctx.session.t_categoria_desc}:\n`
        mensajeMontoConfirm += `       Monto $${ctx.session.monto.toLocaleString('es-CL')}`
        mensajeMontoConfirm += `\n\n/1_Aceptar\n/2_Cancelar`
        ctx.reply(mensajeMontoConfirm);

        ctx.wizard.next()
    },
    //PASO 4
    async (ctx) => {
        let opcion = ctx.message.text.trim().match(/\/(\d+)_/)
        opcion = opcion ? opcion[1] : ctx.message.text.trim()

        switch (opcion) {
            case '1':
                ctx.reply('⏳ Cargando gasto...');
                ctx.session.cargar_gasto_trans = true
                cargarGastoTransporteDB(ctx)
                ctx.scene.leave(); 
                break;
            case '2':
                await ctx.reply('🗑️ Gasto abortado.');
                ctx.session.monto = null
                ctx.session.cargar_gasto_trans = false
                ctx.scene.leave();     
                break;
        
            default:
                await ctx.reply('❌ Opción no válida.')
                await ctx.reply(mensajeMontoConfirm)
                return
        }
    },
)

export default cargaGastoCorriente