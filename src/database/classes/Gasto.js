import { consultarDatabase } from "../data-base.js";

export class Gasto {

    constructor(id = null, fecha = '', fecha_pago = '', adeudado = ''
        , descripcion = '', t_categoria = null, monto = null, user_at) {
        this.id = id
        this.fecha = fecha
        this.fecha_pago = fecha_pago
        this.adeudado = adeudado
        this.descripcion = descripcion
        this.t_categoria = t_categoria
        this.monto = monto
        this.user_at = user_at
    }

    insertarGasto() {

        if (!this.fecha ||isNaN(this.t_categoria) ||isNaN(this.monto) ||!this.user_at) {
            return false
        }

        const fecha_pago = this.fecha_pago != '' ?  "'" + this.fecha_pago + "'" : "NULL"
        const adeudado =  this.adeudado != '' ?  "'" + this.adeudado + "'" : "NULL"

        let query = `INSERT INTO GASTO`
        query += `(FECHA, FECHA_PAGO, ADEUDADO, DESCRIPCION, T_CATEGORIA, MONTO, USER_AT)`
        query += ` VALUES(`
        query += `'${this.fecha}',`
        query += `${fecha_pago},`
        query += `${adeudado},`
        query += `'${this.descripcion}',`
        query += ` ${this.t_categoria},`
        query += ` ${this.monto},`
        query += `'${this.user_at}'`
        query += `);`
    
        return consultarDatabase(query,2)
    }

    actualizarOInsertarGastoCorriente() {

        if (!this.monto || !this.t_categoria || isNaN(this.monto) || isNaN(this.t_categoria)) {
            return new Promise((resolve, reject) => reject(`BUABUA`))
        }

        let query = `UPDATE GASTO `
        query += `SET MONTO = IFNULL(MONTO + ${this.monto}, ${this.monto}) `
        query += `WHERE T_CATEGORIA = ${this.t_categoria} `
        query += `AND FECHA = DATE(NOW()) `

        return consultarDatabase(query,2)
        
    }

    consultarResumenMensual() {
        let query = `SELECT * FROM VW_RESUMEN_MENSUAL`

        return consultarDatabase(query,2)

    }

    consultarAdeudadosMesActual() {
        let query = `SELECT * FROM GASTO g WHERE TRIM(ADEUDADO) NOT IN ('', '*', 'ZZ') `
        query += ` AND ADEUDADO IS NOT NULL AND FECHA <= LAST_DAY(CURDATE())`
        query += ` ORDER BY ADEUDADO ASC`

        return consultarDatabase(query,2)
    }

    consultarAdeudadosCompleta() {
        let query = `SELECT * FROM GASTO g WHERE TRIM(ADEUDADO) NOT IN ('', '*', 'ZZ') `
        query += ` AND ADEUDADO IS NOT NULL`
        query += ` ORDER BY ADEUDADO ASC`

        return consultarDatabase(query,2)
    }

}