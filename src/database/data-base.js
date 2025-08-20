import mysql from "mysql2"

function conectarDataBase(conexion) {
        
    let connection = null

    switch (conexion) {
        case 1:
            connection = mysql.createConnection({
                host: process.env.DB_HOST, 
                user: process.env.DB_USER,
                // port: process.env.DB_PORT,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME 
            });
            break;
        case 2:
            connection = mysql.createConnection({
                host: process.env.DB2_HOST, 
                user: process.env.DB2_USER,
                // port: process.env.DB_PORT,
                password: process.env.DB2_PASSWORD,
                database: process.env.DB2_NAME 
            });
            break;
    }

    connection.connect((err) => {
        if (err) console.error();
    });

    return connection;
}
    
export function consultarDatabase(query, conexion = 1) {
    return new Promise((resolve, reject) => {

        if (global.G_print_query) console.log(`🐞 ${query}`)
        
            const connection = conectarDataBase(conexion)
            
            connection.query(query, async (error, resp) => {
                if (error) {
                    console.error(`⚠️`, ` `, `ERROR: NO SE PUDO CONECTAR A LA BASE DE DATOS`);
                    console.error(`⚠️`, ` `, `QUERY>`);
                    console.error(`⚠️`, ` `, query);
                    console.error(`⚠️`, ` `, `ERROR>`);
                    console.error(`⚠️`, ` `, error);

                    if (process.env.ALERTAR_ERRROR_DB) {
                        await global.G_bot.telegram.sendMessage(process.env.USER_MASTER, '💢')
                        await global.G_bot.telegram.sendMessage(process.env.USER_MASTER, 'ERROR EN BASE DE DATOS')
                        await global.G_bot.telegram.sendMessage(process.env.USER_MASTER, query)
                        await global.G_bot.telegram.sendMessage(process.env.USER_MASTER, error)
                    }
                    
                    reject(error);
                }
                
                resolve(resp);
            });
    })
}