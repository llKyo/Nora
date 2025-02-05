import { Scenes } from 'telegraf';
import { cargarGastoEnBD } from '../commands/gastos.js';
import { TipoCategoriaGasto } from '../../../database/classes/TipoCategoriaGasto.js';

let aCategoriasGastos = []
let sCategoriaGastos = ''

let msjSelectCategorias = ''

const userChoices = new Map();

function reemplazarTildesYN(cadena) {
    return cadena
        .replace(/[áÁ]/g, "a")
        .replace(/[éÉ]/g, "e")
        .replace(/[íÍ]/g, "i")
        .replace(/[óÓ]/g, "o")
        .replace(/[úÚ]/g, "u")
        .replace(/[ñÑ]/g, "n");
}

const cargaGastosScene = new Scenes.WizardScene('cargaGastosScene',

    // PASO 1: MOSTRAR CATEGORIAS
    async (ctx) => {
        msjSelectCategorias = ''
        sCategoriaGastos = ''

        msjSelectCategorias = '💠 Selecciona una categoría de gasto:\n'

        const tipoCategoriaGasto = new TipoCategoriaGasto()
        aCategoriasGastos = await tipoCategoriaGasto.obtenerCategoriasVigentes()
        
        aCategoriasGastos.forEach(({DESCRIPCION}, i) => {

            let descripcion = DESCRIPCION.replace(/\s/g, "_")

            sCategoriaGastos += `\n/${(i + 1)}_${reemplazarTildesYN(descripcion)}`
        })
        
        msjSelectCategorias += sCategoriaGastos

        ctx.reply(msjSelectCategorias);
        return ctx.wizard.next();
    },

    // PASO 2: VALIDAR OPCIÓN SELECCIONADA 
    async (ctx) => {
        let categoria = ctx.message.text.trim().match(/\/(\d+)_/)
        categoria = categoria ? categoria[1] : ctx.message.text.trim()

        if (!aCategoriasGastos.hasOwnProperty(categoria - 1)) {

            ctx.reply('❌ Categoría no válida.');
            ctx.reply(msjSelectCategorias);
            return; 
        }

        ctx.session.categoria = categoria;
        ctx.session.id_categoria = aCategoriasGastos[categoria - 1].TIPO;
        ctx.session.categoria_desc = aCategoriasGastos[categoria - 1].DESCRIPCION;

        await ctx.reply('💰 Ingrese un monto:');

        return ctx.wizard.next();
    },

    // PASO 3
    async (ctx) => {
        const monto = ctx.message.text.trim();

        if (isNaN(monto)) {
            await ctx.reply('❌ Opción no válida. El valor ingresado no es un número.');
            await ctx.reply('💰 Ingrese un monto:');
            return; 
        }

        if (parseInt(monto) <= 0) {
            await ctx.reply('❌ Opción no válida. El valor ingresado no es un número positivo.');
            await ctx.reply('💰 Ingrese un monto:');
            return; 
        }

        ctx.session.monto = parseInt(monto);

        await ctx.reply(`🔸Ingrese descripción`);
        
        return ctx.wizard.next();
    },

    // PASO 4
    (ctx) => {

        const descripcion = ctx.message.text.trim();

        ctx.session.descripcion = descripcion;

        ctx.reply(`🔸¿Es un gasto adeudado?\n\n/1_Si\n/2_No`);

        return ctx.wizard.next();
    },

    // PASO 5
    async (ctx) => {
        let repuesta = ctx.message.text.trim().match(/\/(\d+)_/)
        repuesta = repuesta ? repuesta[1] : ctx.message.text.trim()

        switch (repuesta) {
            case '1':
                ctx.session.adeudado = true;
                break;
            case '2':
                ctx.session.adeudado = false;
                break;
            default:
                await ctx.reply('❌ Opción no válida.')
                await ctx.reply(`🔸¿Es un gasto adeudado?\n\n1. Si\n2. No`);
                return 
        }

        if (ctx.session.adeudado) {
            await ctx.reply('👉 Ingrese una letra para el adeudado:');
        } else {
            ctx.session.letra_adeudado = null

            const {categoria, categoria_desc, monto, descripcion} = ctx.session

            let mensaje = `🟡 Resumen\n\n`
            mensaje += `Categoría:         (${categoria}) - ${categoria_desc}\n`
            mensaje += `Monto:              $ ${monto.toLocaleString('es-CL')}\n`
            mensaje += `Descripción:    ${descripcion}\n`
            mensaje += `\n/1_Cargar\n/2_Cancelar`

            await ctx.reply(mensaje);

            ctx.wizard.selectStep(5);
            return ctx.wizard.next();

        }
        return ctx.wizard.next();
    },

    // PASO 6
    async (ctx) => {
        const letra_adeudado = ctx.message.text.trim();

        if (letra_adeudado.length != 1) {
            await ctx.reply('❌ Opción no válida. Debe ingresar 1 caracter.')
            await ctx.reply('👉 Ingrese una letra para el adeudado:');

            
            return
            
        }

        ctx.session.letra_adeudado = letra_adeudado

        const {categoria, categoria_desc, monto, descripcion} = ctx.session

        let mensaje = `🟡 Resumen\n\n`
        mensaje += `Categoría:         (${categoria}) - ${categoria_desc}\n`
        mensaje += `Monto:              $ ${monto.toLocaleString('es-CL')}\n`
        mensaje += `Descripción:    ${descripcion}\n`
        mensaje += `Adeudado:       ${letra_adeudado}\n`
        mensaje += `\n/1_Cargar\n/2_Cancelar`

        await ctx.reply(mensaje);

        return ctx.wizard.next();
    },

    // PASO 7
    async (ctx) => {          
        let cargar = ctx.message.text.trim().match(/\/(\d+)_/)
        cargar = cargar ? cargar[1] : ctx.message.text.trim()    

        if (cargar == '1') {
            await ctx.reply('⏳ Cargando gasto...');
            ctx.scene.leave(); 
            cargarGastoEnBD(ctx)
        }else {
            await ctx.reply('🗑️ Gasto abortado.');
            ctx.scene.leave(); 
        }

    }
    
);

export default cargaGastosScene;
