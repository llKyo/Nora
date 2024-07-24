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

        let query = `SELECT ID_USUARIO FROM DESTINATARIO_CRON WHERE VIGENTE = 1 `;
        query += ` AND FUNCION_CRON = '${this.funcion_cron}'`;

        return consultarDatabase(query)
    }
}