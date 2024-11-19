import { consultarDatabase } from "../data-base.js";

export class DestinatarioCron {

    constructor(id, id_usuario = null, funcion_cron = null, vigente = null, r_usuario = null) {
        this.id             = id;
        this.id_usuario     = id_usuario;
        this.funcion_cron   = funcion_cron;
        this.vigente        = vigente;
        this.r_usuario      = r_usuario;
    }

    obtenerDestinatarioPorFuncionCron() {
        if (!this.funcion_cron) this.funcion_cron = 'NULL'

        let query = `SELECT DC.USUARIO_ID, U.NAME, DC.COMANDO_ID, C.PROMPT `
        query += `FROM DESTINATARIO_CRON DC `
        query += `INNER JOIN USUARIO U ON U.ID = DC.USUARIO_ID `
        query += `INNER JOIN COMANDO C ON C.ID = DC.COMANDO_ID `
        query += ` AND DC.COMANDO_ID = ${this.comando_id}`;
        query += ` AND DC.ES_VIGENTE = 1`;

        return consultarDatabase(query)
    }
}