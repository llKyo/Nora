import { consultarDatabase } from "../data-base.js";

export class AgendaCron {

    constructor(id, expresion_cron = null, funcion_id = null, vigente = null, user_at = null) {
        this.id             = id;
        this.expresion_cron = expresion_cron;
        this.funcion_id     = funcion_id;
        this.vigente        = vigente;
        this.user_at        = user_at;
    }

    obtenerTodosLosCronVigentes() {
        let query =  `SELECT EXPRESION_CRON, PROMPT FROM AGENDA_CRON AC `
        query += `INNER JOIN COMANDO C `
        query += `ON C.ID = AC.ID `
        query += `WHERE AC.ES_VIGENTE = 1 `;
        query += `AND C.ES_VIGENTE = 1 `;

        return consultarDatabase(query)
    }
}