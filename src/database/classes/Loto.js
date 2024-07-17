import { consultarDatabase } from "../data-base.js";


export class Loto {

    constructor(id, fecha = null, monto = null, r_usuario = null) {
        this.id         = id;
        this.fecha      = fecha;
        this.monto      = monto;
        this.r_usuario  = r_usuario;
    }

    registrar(){

        const fecha         = this.fecha ?  "'" + this.fecha   + "'" : "NULL"
        const monto         = this.monto ?  this.monto : "NULL"
        const r_usuario     = this.r_usuario  ?  "'" + this.r_usuario  + "'" : "NULL"


        let query = "INSERT INTO LOTO"
        query += "(FECHA, MONTO, R_USUARIO) VALUES("
        query += `${fecha},`
        query += ` ${monto},`
        query += ` ${r_usuario})`

        return consultarDatabase(query)
    }
}