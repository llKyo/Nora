import { consultarDatabase } from "../data-base.js";

export class DestinatarioCron {

    constructor(id, usuario_id = null, comando_id = null, vigente = null, user_at = null) {
        this.id             = id;
        this.usuario_id     = usuario_id;
        this.comando_id     = comando_id;
        this.vigente        = vigente;
        this.user_at        = user_at;
    }

    obtenerDestinatarioPorFuncionCron() {
        if (!this.comando_id) return [];

        let query = `SELECT DC.USUARIO_ID, U.NAME FROM DESTINATARIO_CRON DC INNER JOIN USUARIO U ON U.ID = DC.USUARIO_ID WHERE DC.ES_VIGENTE = 1 `;
        query += ` AND DC.COMANDO_ID = ${this.comando_id}`;

        return consultarDatabase(query)
    }
}