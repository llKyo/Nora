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

        let query = `SELECT COUNT(1) FROM PERMISO_USUARIO `
        query += `WHERE VIGENTE = 1 `
        query += `AND ID_USUARIO = ${this.id_usuario} `
        query += `AND ID_PERMISO = ${this.id_permiso} `

        return consultarDatabase(query)
    }
}