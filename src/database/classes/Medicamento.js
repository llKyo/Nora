import { consultarDatabase } from "../data-base.js";


export class Medicamento {

    constructor(id, nombre = null, dosis_diaria = null, stock = null, es_vigente = null, notas = null, user_at = null) {
        this.id             = id;
        this.nombre         = nombre;
        this.dosis_diaria   = dosis_diaria;
        this.es_vigente     = es_vigente;
        this.notas          = notas;
        this.stock          = stock;
        this.user_at        = user_at;
    }

    obtenerMedicamentosVigentes(){

        let query = 'SELECT ID, NOMBRE, DOSIS_DIARIA, STOCK, ES_VIGENTE, NOTAS FROM MEDICAMENTO WHERE ES_VIGENTE = 1'

        return consultarDatabase(query)
    }

    actualizarStock(){

        if (!this.id || isNaN(this.stock)) return false

        let query = `UPDATE MEDICAMENTO `
        query += `SET STOCK=${this.stock} `
        query += `, USER_AT='${this.user_at}' `
        query += `WHERE ID= ${this.id}; `

        return consultarDatabase(query)
    }

    // obtenerMedicCompradosVigentes(){

    //     let query = 'SELECT ID, NOMBRE, DOSIS_DIARIA, COMPRADO FROM V_MEDIC_COMPRADOS_VIG'

    //     return consultarDatabase(query)
    // }

    // obtenerMedicConsumAcum(){

    //     let query = 'SELECT ID_MEDICAMENTO, FECHA, ACUMULADO FROM V_MEDIC_CONSUM_ACUM'

    //     return consultarDatabase(query)
    // }

    // obtenerMedicConsumidos(){

    //     let query = 'SELECT ID, NOMBRE, CONSUMIDO FROM V_MEDIC_CONSUMIDO_VIG'

    //     return consultarDatabase(query)
    // }

    // obtenerMedicConsumidos(){

    //     let query = 'SELECT ID, NOMBRE, CONSUMIDO FROM V_MEDIC_CONSUMIDO_VIG'

    //     return consultarDatabase(query)
    // }
}