import { consultarDatabase } from "../data-base.js";


export class LogConsulta {

    constructor(id, consulta = null, id_usuario = null, usuario = null, nombre = null, r_usuario = null) {
        this.id         = id;
        this.consulta   = consulta;
        this.id_usuario = id_usuario;
        this.usuario    = usuario;
        this.nombre     = nombre;
        this.r_usuario  = r_usuario ? r_usuario : id;
    }

    registrar(){

        const consulta      = this.consulta   ?  "'" + this.consulta   + "'" : "NULL"
        const id_usuario    = this.id_usuario ?  "'" + this.id_usuario + "'" : "NULL"
        const usuario       = this.usuario ?  "'" + this.usuario + "'" : "NULL"
        const nombre        = this.nombre ?  "'" + this.nombre + "'" : "NULL"
        const r_usuario     = this.r_usuario  ?  "'" + this.r_usuario  + "'" : "NULL"


        let query = "INSERT INTO LOG_CONSULTA"
        query += "(CONSULTA, ID_USUARIO, USUARIO, NOMBRE, R_USUARIO) VALUES("
        query += `${consulta},`
        query += ` ${id_usuario},`
        query += ` ${usuario},`
        query += ` ${nombre},`
        query += ` ${r_usuario})`

        return consultarDatabase(query)
    }
}