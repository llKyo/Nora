import { consultarDatabase } from "../data-base.js";

export class AgendaCron {

    constructor(id, expresion_cron = null, funcion = null, vigente = null, r_usuario = null) {
        this.id             = id;
        this.expresion_cron = expresion_cron;
        this.funcion        = funcion;
        this.vigente        = vigente;
        this.r_usuario      = r_usuario;
    }

    obtenerTodosLosCronVigentes() {
        let query =  `SELECT AC.EXPRESION_CRON, C.PROMPT FROM AGENDA_CRON AC INNER JOIN COMANDO C ON C.ID = AC.COMANDO_ID WHERE AC.ES_VIGENTE = 1`;

        return consultarDatabase(query)
    }
}