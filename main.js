import moment from "moment";
import { configurar } from "./config.js";
import { iniciarBot } from "./src/modules/bot/bot-telegram.js";

console.clear()

configurar()

iniciarBot()

// console.log('\x1b[36m%s\x1b[0m', 'I am cyan');  //cyan
// console.log('I am cyan 2');  //cyan
// console.log('\x1b[33m%s\x1b[0m', "AAA");  //yellow

// const a = {1:1,2:2,3:3,4:4,7:5}


// console.table(a)


// console.log();