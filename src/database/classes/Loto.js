import { consultarDatabase } from "../data-base.js";


export class Loto {

    constructor(id, fecha = null, monto = null, user_at = null) {
        this.id         = id;
        this.fecha      = fecha;
        this.monto      = monto;
        this.user_at    = user_at;
    }

    registrar(){

        const fecha         = this.fecha ?  "'" + this.fecha   + "'" : "NULL"
        const monto         = this.monto ?  this.monto : "NULL"
        const user_at       = this.user_at  ?  "'" + this.user_at  + "'" : "NULL"


        let query = "INSERT INTO LOTO"
        query += "(FECHA, MONTO, USER_AT) VALUES("
        query += `${fecha},`
        query += ` ${monto},`
        query += ` ${user_at})`

        return consultarDatabase(query)
    }
}