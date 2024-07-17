import { consultarDatabase } from "../data-base.js"

export class Permiso {
    constructor(id, comando = "", t_acceso = "", vigente, r_usuario) {
        this.id         = id
        this.comando    = comando
        this.t_acceso   = t_acceso
        this.vigente    = vigente
        this.r_usuario  = r_usuario ? r_usuario : id
    }

    consultarPermisosVigentesPorComando() {
        let query = `SELECT ID, T_ACCESO FROM PERMISO `
        query += `WHERE VIGENTE = 1 `
        query += `AND COMANDO = '${this.comando}'`

        return consultarDatabase(query)
    }
}