import sqlite3 from "sqlite3"

function conectarDataBase() {
    return new sqlite3.Database(process.env.DATABASE_PATH)
}
    
export function consultarDatabase(query) {
    return new Promise((resolve, reject) => {

        const sqlite3 = conectarDataBase()

        if (G_print_query) console.log(query)

        sqlite3.all(query, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}