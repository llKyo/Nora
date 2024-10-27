import { consultarDatabase } from "../data-base.js"

export class Permiso {
    constructor(id, prompt = "", t_acceso_id = "", vigente, r_usuario) {
        this.id             = id
        this.prompt         = prompt
        this.t_acceso_id    = t_acceso_id
        this.vigente        = vigente
        this.r_usuario      = r_usuario ? r_usuario : id
    }

    consultarPermisosVigentesPorComando() {
        let query = `SELECT ID, T_ACCESO_ID FROM COMANDO `
        query += `WHERE ES_VIGENTE = 1 `
        query += `AND PROMPT = '${this.comando}'`

        return consultarDatabase(query)
    }
}