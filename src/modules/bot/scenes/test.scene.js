import {Telegraf, Scenes, session, Markup} from 'telegraf'
const { WizardScene } = Scenes;

// Estado para almacenar las selecciones por usuario
const userSelections = new Map();

// Categorías disponibles
const categorias = ['Categoría 1', 'Categoría 2', 'Categoría 3', 'Categoría 4'];

// Función para generar el teclado dinámico con selección única
const generarTeclado = (seleccion) => {
  return Markup.inlineKeyboard(
    categorias.map((categoria) => {
      const estado = seleccion === categoria ? '✅' : ''; // Agregar ✅ si está seleccionada
      return Markup.button.callback(`${categoria} ${estado}`, `select_${categoria}`);
    })
  );
};

// Escena de selección de categoría
const testScene = new WizardScene(
  'testScene',
  (ctx) => {
    const userId = ctx.from.id;

    // Inicializa la selección del usuario
    if (!userSelections.has(userId)) {
      userSelections.set(userId, null); // Sin selección inicial
    }

    const seleccion = userSelections.get(userId);

    // Muestra las categorías al usuario
    ctx.reply(
      'Selecciona una categoría (solo una puede estar activa):',
      generarTeclado(seleccion)
    );

    // Mantiene al usuario en este paso
    return ctx.wizard.next();
  },
  async (ctx) => {
    // Este paso es opcional para finalizar o confirmar la selección
    const userId = ctx.from.id;
    const seleccion = userSelections.get(userId);

    if (!seleccion) {
      await ctx.reply('Debes seleccionar una categoría antes de continuar.');
      return ctx.wizard.selectStep(0); // Permanece en este paso hasta que seleccione
    }

    await ctx.reply(`Has seleccionado: ${seleccion}`);
    return ctx.scene.leave(); // Salir de la escena
  }
);

// Acción para manejar la selección de categorías en el inline keyboard
testScene.action(/select_(.+)/, async (ctx) => {
  const userId = ctx.from.id;
  const categoriaSeleccionada = ctx.match[1]; // Captura la categoría seleccionada

  // Actualiza la selección del usuario
  userSelections.set(userId, categoriaSeleccionada);

  // Actualiza el teclado dinámico para reflejar la nueva selección
  await ctx.editMessageReplyMarkup(generarTeclado(categoriaSeleccionada));

  // Envía una confirmación al usuario
  await ctx.answerCbQuery(`Seleccionaste: ${categoriaSeleccionada}`);
});


export default testScene