import { consultarDatabase } from "../data-base.js"

export class PermisoUsuario {
    constructor(id, id_permiso = null, id_usuario = null, vigente = null, r_usuario) {
        this.id_permiso = id_permiso
        this.id_usuario = id_usuario
        this.vigente    = vigente
        this.r_usuario  = r_usuario ? r_usuario : id
    }

    consultarPermisoPorUsuario() {

        if (!this.id_permiso) this.id_permiso = "NULL"
        if (!this.id_usuario) this.id_usuario = "NULL"

        let query = `SELECT COUNT(1) FROM COMANDO_USUARIO `
        query += `WHERE ES_VIGENTE = 1 `
        query += `AND USUARIO_ID = ${this.id_usuario} `
        query += `AND COMANDO_ID = ${this.id_permiso} `

        return consultarDatabase(query)
    }
}