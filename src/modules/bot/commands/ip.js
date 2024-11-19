import axios from "axios";

export function ip(ctx, esCron = false) {

    axios.get('https://ifconfig.me')
    .then(response => {

        global.G_bot.telegram.sendMessage(process.env.USER_MASTER, `IP pública: ${response.data.trim()}`)

    })
    .catch(error => {
        console.error('Error:', error.message);
    });
    
}