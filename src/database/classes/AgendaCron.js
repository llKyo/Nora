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
        let query =  `SELECT EXPRESION_CRON, FUNCION FROM AGENDA_CRON WHERE VIGENTE = 1 `;

        return consultarDatabase(query)
    }
}