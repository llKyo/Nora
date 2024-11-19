import { consultarDatabase } from "../data-base.js";

export class DestinatarioCron {

    constructor(usuario_id = null, comando_id = null, es_vigente = null, user_at = null) {
        this.usuario_id = usuario_id;
        this.comando_id = comando_id;
        this.es_vigente = es_vigente;
        this.user_at    = user_at;
    }

    obtenerDestinatarioPorFuncionCron() {
        if (!this.comando_id) this.comando_id = 'NULL'

        let query = `SELECT DC.USUARIO_ID, U.NAME, DC.COMANDO_ID, C.PROMPT `
        query += `FROM DESTINATARIO_CRON DC `
        query += `INNER JOIN USUARIO U ON U.ID = DC.USUARIO_ID `
        query += `INNER JOIN COMANDO C ON C.ID = DC.COMANDO_ID `
        query += ` AND DC.ES_VIGENTE = 1`;
        query += ` WHERE C.ID = ${this.comando_id} `;

        return consultarDatabase(query)
    }
}