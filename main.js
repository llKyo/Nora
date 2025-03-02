import dotenv from 'dotenv';

import { configurar } from "./config.js";
import { iniciarBot } from "./src/modules/bot/bot-telegram.js";
import { generarTodoistAPI } from './src/modules/todoist.js';

dotenv.config();

console.clear()

configurar()

generarTodoistAPI()

iniciarBot()