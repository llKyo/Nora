import { consultarDatabase } from "../../../database/data-base.js"

export class Comando {
    constructor(id = null, prompt = 'null', t_acceso_id = null, es_vigente= null, user_at = null) {
        this.id             = id
        this.prompt         = prompt
        this.t_acceso_id    = t_acceso_id
        this.es_vigente     = es_vigente
        this.user_at        = user_at
    }

    consultarTipoAccesoVigentesPorComando() {
        let query = `SELECT ID, T_ACCESO_ID FROM COMANDO C `
        query += `WHERE ES_VIGENTE = 1 `
        query += `AND PROMPT = '${this.prompt}'`

        return consultarDatabase(query)
    }
}