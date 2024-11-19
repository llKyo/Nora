import { consultarDatabase } from "../data-base.js"

export class PermisoUsuario {
    constructor(id, id_permiso = null, id_usuario = null, vigente = null, user_at) {
        this.id_permiso = id_permiso
        this.id_usuario = id_usuario
        this.vigente    = vigente
        this.user_at    = user_at ? user_at : id
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