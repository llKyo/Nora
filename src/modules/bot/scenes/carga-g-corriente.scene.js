import { Scenes } from 'telegraf';
import { cargarGastoTransporteDB } from '../commands/corriente.js';
import { GastoCorriente } from '../../../database/classes/GastoCorriente.js';

let aGastoTransComunes = []
let aGastoComComunes = []

async function cargarGastoComun(t_categoria_gasto){
    const gastoCorriente = new GastoCorriente()
    gastoCorriente.t_categoria_gasto = t_categoria_gasto

    let gastos = await gastoCorriente.consultarVigentePorTipo()

    gastos = gastos.map(g => ({
        ...g,
        DESCRIPCION: g.DESCRIPCION.replace(/ /g, '_')
    }));

    gastos.push({
        ID:0,
        DESCRIPCION:"Otros",
        T_CATEGORIA_GASTO:t_categoria_gasto,
        ORDEN:0,
        MONTO:0
    })

    return gastos
}


const aCategorias = [
    {ID:1,DESCRIPCION:"Comida", T_CATEGORIA:2},
    {ID:2,DESCRIPCION:"Transporte", T_CATEGORIA:10},
]

let slcCategorias = ''
let mensajeMontoConfirm = ''
let slcTCategoria = ''

function obtenerOpcion(ctx){
    let opcion = ctx.message.text.trim().match(/\/(\d+)_/)
    
    opcion = opcion ? opcion[1] : ctx.message.text.trim()

    return opcion
}

const cargaGastoCorriente = new Scenes.WizardScene('cargaGastoCorriente',
    async (ctx) => {

        aGastoComComunes = await cargarGastoComun(2)
        aGastoTransComunes = await cargarGastoComun(10)

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
        let opcion = obtenerOpcion(ctx)

        if (opcion == '*') {
            ctx.reply('❌ Proceso detenido.');
            ctx.scene.leave()
            return
        }

        switch (opcion) {
            case '1':
                slcCategorias = '🍎 Selecciona una opción común:\n'

                aGastoComComunes.forEach(({DESCRIPCION, MONTO, ORDEN}, i) => {
                    slcCategorias += `\n/${ORDEN}_${DESCRIPCION} - $${MONTO.toLocaleString('es-CL')}`
                });

                ctx.session.t_categoria = 2
                ctx.session.t_categoria_desc = 'Comida'

                break;
            case '2':
                slcCategorias = '🚗 Selecciona una opción común:\n'

                aGastoTransComunes.forEach(({DESCRIPCION, MONTO, ORDEN}, i) => {
                    slcCategorias += `\n/${ORDEN}_${DESCRIPCION} - $${MONTO.toLocaleString('es-CL')}`
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
        let opcion = obtenerOpcion(ctx)

        if (opcion == '*') {
            ctx.reply('❌ Proceso detenido.');
            ctx.scene.leave()
            return
        }
        
        switch (ctx.session.t_categoria) {
            case 2:
                if (isNaN(opcion) || !aGastoComComunes.some(g=> g.ORDEN == opcion)) {

                    await ctx.reply('❌ Opción no válida.');
                    await ctx.reply(slcCategorias);
                    return; 
                }
                const gastoCom = aGastoComComunes.find(g => g.ORDEN == opcion)
        
                ctx.session.categoria = opcion;
                ctx.session.tipo_gasto = gastoCom.ID;
                ctx.session.tipo_gasto_desc = gastoCom.DESCRIPCION;
                ctx.session.monto = gastoCom.MONTO;
                break;
            case 10:
                if (isNaN(opcion) || !aGastoTransComunes.some(g=> g.ORDEN == opcion)) {

                    await ctx.reply('❌ Opción no válida.');
                    await ctx.reply(slcCategorias);
                    return; 
                }

                const gastoTrans = aGastoTransComunes.find(g => g.ORDEN == opcion)

        
                ctx.session.categoria = opcion;
                ctx.session.tipo_gasto = gastoTrans.ID;
                ctx.session.tipo_gasto_desc = gastoTrans.DESCRIPCION;
                ctx.session.monto = gastoTrans.MONTO;
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
        let opcion = obtenerOpcion(ctx)

        if (opcion == '*') {
            ctx.reply('❌ Proceso detenido.');
            ctx.scene.leave()
            return
        }

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