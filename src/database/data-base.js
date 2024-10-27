import mysql from "mysql2"

function conectarDataBase() {

    const connection = mysql.createConnection({
        host: process.env.DB_HOST, 
        user: process.env.DB_USER,
        port: process.env.DB_PORT,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME 
    });

    connection.connect((err) => {
        if (err) console.error();
    });

    return connection;
}
    
export function consultarDatabase(query) {
    return new Promise((resolve, reject) => {

        if (G_print_query) console.log(`🐞 ${query}`)
        
            const connection = conectarDataBase()
            
            connection.query(query, async (error, resp) => {
                if (error) {
                    console.error(`⚠️`, ` `, `ERROR: NO SE PUDO CONECTAR A LA BASE DE DATOS`);
                    console.error(`⚠️`, ` `, `QUERY>`);
                    console.error(`⚠️`, ` `, query);

                    if (process.env.ALERTAR_ERRROR_DB) {
                        await global.G_bot.telegram.sendMessage(process.env.USER_MASTER, '💢')
                        await global.G_bot.telegram.sendMessage(process.env.USER_MASTER, 'ERROR EN BASE DE DATOS')
                        await global.G_bot.telegram.sendMessage(process.env.USER_MASTER, query)
                    }
                    
                    reject(error);
                }
                
                resolve(resp);
            });
    })
}