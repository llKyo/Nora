import { consultarDatabase } from "../data-base.js";


export class LogConsulta {

    constructor(id, consulta = null, id_usuario = null, usuario = null, nombre = null, user_at = null) {
        this.id         = id;
        this.consulta   = consulta;
        this.id_usuario = id_usuario;
        this.usuario    = usuario;
        this.nombre     = nombre;
        this.user_at    = user_at ? user_at : id;
    }

    registrar(){

        const consulta      = this.consulta   ?  "'" + this.consulta   + "'" : "NULL"
        const id_usuario    = this.id_usuario ?  "'" + this.id_usuario + "'" : "NULL"
        const usuario       = this.usuario ?  "'" + this.usuario + "'" : "NULL"
        const nombre        = this.nombre ?  "'" + this.nombre + "'" : "NULL"
        const user_at       = this.user_at  ?  "'" + this.user_at  + "'" : "NULL"


        let query = "INSERT INTO LOG_CONSULTA"
        query += "(CONSULTA, ID_USUARIO, USUARIO, NOMBRE, USER_AT) VALUES("
        query += `${consulta},`
        query += ` ${id_usuario},`
        query += ` ${usuario},`
        query += ` ${nombre},`
        query += ` ${user_at})`

        return consultarDatabase(query)
    }
}