import { consultarDatabase } from "../data-base.js"

export class MinutaCasino {
    constructor(id, periodo = "", url = "", user_at) {
        this.id = id
        this.periodo = periodo
        this.url = url
        this.user_at = user_at ? user_at : id
    }

    consultar() {}

    registrar() {
        let query = `INSERT INTO MINUTA_CASINO ( PERIODO, URL, USER_AT) VALUES`
        query += `('${this.periodo}'`
        query += `,'${this.url}'`
        query += `,'${this.user_at ? this.user_at : this.id}'`
        query += `);`

        return consultarDatabase(query)
    }

    actualizar() {}

    eliminar() {}

    siExisteURL() {
        let query = `SELECT COUNT(1) FROM MINUTA_CASINO `
        query += `WHERE URL = '${this.url}'`

        return consultarDatabase(query)
    }

    registrarSiNoExiste(){
        return new Promise((resolve, reject) => {

            this.siExisteURL().then((result) => {

                if (result[0]["COUNT(1)"] == 0) {
                    this.registrar().then(res => resolve(true))
                } else{
                    resolve(false)
                }
            }).catch((err) => {
                reject(err)
            });
        })
    }
}