import { min } from "moment"
import { consultarDatabase } from "../data-base.js"

export class Permiso {
    constructor(comando_id, usuario_id, es_vigente = null, user_at = null) {
        this.comando_id = comando_id
        this.usuario_id = usuario_id
        this.es_vigente = es_vigente
        this.user_at    = user_at ? user_at : usuario_id
    }

    consultarPermisosVigentesPorComando() {
        let query = `SELECT ID, T_ACCESO FROM PERMISO `
        query += `WHERE VIGENTE = 1 `
        query += `AND COMANDO = '${this.comando}'`

        return consultarDatabase(query)
    }
}