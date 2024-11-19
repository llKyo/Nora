import { consultarDatabase } from "../data-base.js"

export class ComandoUsuario {
    constructor(comando_id = null, usuario_id = null, es_vigente = null, user_at) {
        this.comando_id = comando_id
        this.usuario_id = usuario_id
        this.es_vigente = es_vigente
        this.user_at    = user_at ? user_at : usuario_id
    }

    consultarPermisoPorUsuario() {

        if (!this.comando_id) this.comando_id = "NULL"
        if (!this.usuario_id) this.usuario_id = "NULL"

        let query = `SELECT COUNT(1) FROM COMANDO_USUARIO `
        query += `WHERE ES_VIGENTE = 1 `
        query += `AND USUARIO_ID = ${this.usuario_id} `
        query += `AND COMANDO_ID = ${this.comando_id} `

        return consultarDatabase(query)
    }
}