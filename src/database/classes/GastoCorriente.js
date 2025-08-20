import { consultarDatabase } from "../data-base.js";

export class GastoCorriente {

    constructor(
        id = null, 
        descripcion = '', 
        t_categoria_gasto = null, 
        vigente = null, 
        orden = null, 
        monto = null, 
        user_at) 
    {
        this.id = id
        this.descripcion = descripcion
        this.t_categoria_gasto = t_categoria_gasto
        this.vigente = vigente
        this.orden = orden
        this.monto = monto
        this.user_at = user_at
    }

    consultarVigentePorTipo() {

        if (!this.t_categoria_gasto) return false

        let query = `SELECT * FROM GASTO_CORRIENTE `
        query += `WHERE T_CATEGORIA_GASTO = ${this.t_categoria_gasto} `
        query += `AND VIGENTE = 1 `
        query += `ORDER BY ORDEN `

        return consultarDatabase(query,2)
    }
}