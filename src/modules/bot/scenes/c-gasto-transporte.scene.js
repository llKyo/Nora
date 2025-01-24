import { Scenes } from 'telegraf';
import { cargarGastoTransporteDB } from '../commands/transporte.js';

const aGastoComunes = [
    {ID:1,DESCRIPCION:"Colectivo",MONTO:900},
    {ID:2,DESCRIPCION:"Micro_Local",MONTO:400},
    {ID:3,DESCRIPCION:"Micro_Normal",MONTO:470},
    {ID:4,DESCRIPCION:"Micro_Directo",MONTO:560},
    {ID:5,DESCRIPCION:"Otros",MONTO:0},
]

let slcCategorias = ''
let mensajeMontoConfirm = ''

const cargaGastoTransporte = new Scenes.WizardScene('cargaGastoTransporte',
    //PASO 1
    (ctx) => {

        ctx.session.categoria = null
        ctx.session.tipo_gasto = null
        ctx.session.tipo_gasto_desc = null
        ctx.session.monto = null

        slcCategorias = '💠 Selecciona una opcion:'

        aGastoComunes.forEach(({DESCRIPCION, MONTO}, i) => {
            slcCategorias += `\n/${i + 1}_${DESCRIPCION} - $${MONTO}`
        });

        ctx.reply(slcCategorias)
        ctx.wizard.next()
    },
    //PASO 2
    async (ctx) => {
        let opcion = ctx.message.text.trim().match(/\/(\d+)_/)
        opcion = opcion ? opcion[1] : ctx.message.text.trim()
        
        if (isNaN(opcion) || !aGastoComunes.hasOwnProperty(opcion - 1)) {

            await ctx.reply('❌ Opción no válida.');
            await ctx.reply(slcCategorias);
            return; 
        }

        ctx.session.categoria = opcion - 1;
        ctx.session.tipo_gasto = aGastoComunes[opcion - 1].ID;
        ctx.session.tipo_gasto_desc = aGastoComunes[opcion - 1].DESCRIPCION;
        ctx.session.monto = aGastoComunes[opcion - 1].MONTO;

        if (ctx.session.monto == 0) {
            ctx.reply('💰 Ingrese un monto:');
            ctx.wizard.next()
        } else {

            mensajeMontoConfirm = `🟡 Confirmación de la carga Tranporte:\n`
            mensajeMontoConfirm += `       Monto $${ctx.session.monto.toLocaleString('es-CL')}`
            mensajeMontoConfirm += `\n\n/1_Aceptar\n/2_Cancelar`
            ctx.reply(mensajeMontoConfirm);

            return ctx.wizard.selectStep(3);
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
        
        mensajeMontoConfirm = `🟡 Confirmación de la carga Tranporte:\n`
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

export default cargaGastoTransporte