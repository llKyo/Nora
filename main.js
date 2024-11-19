import dotenv from 'dotenv';

import { configurar } from "./config.js";
import { iniciarBot } from "./src/modules/bot/bot-telegram.js";

dotenv.config();

console.clear()

configurar()

iniciarBot()