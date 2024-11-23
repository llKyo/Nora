import { consultarDatabase } from "../data-base.js";


export class ConsumoMedicamento {

    constructor(id= null, medicamento_id= null, fecha_consumo= null, consumido= null, respaldo= null, sincronizado= null, user_at = null) {
        this.id             = id;
        this.medicamento_id = medicamento_id;
        this.fecha_consumo  = fecha_consumo;
        this.consumido      = consumido;
        this.respaldo       = respaldo;
        this.sincronizado   = sincronizado;
        this.user_at        = user_at;
    }

    obtenerReglaMedicamento(){

        if (!this.medicamento_id || !this.fecha_consumo) return []

        let query = `SELECT CM.ID, MEDICAMENTO_ID, M.DOSIS_DIARIA, M.STOCK, CM.CONSUMIDO `
        query += `, CM.SINCRONIZADO FROM CONSUMO_MEDICAMENTO CM `
        query += `INNER JOIN MEDICAMENTO M `
        query += `ON  M.ID = CM.MEDICAMENTO_ID `
        query += `AND M.ES_VIGENTE = 1 `
        query += `WHERE FECHA_CONSUMO = '${this.fecha_consumo}' `
        query += `AND MEDICAMENTO_ID = ${this.medicamento_id} `
        query += `AND SINCRONIZADO = 0`

        return consultarDatabase(query)
    }

    actualizarSincronizacion(){

        console.log(isNaN(this.consumido) || isNaN(this.respaldo) || isNaN(this.id));
        
        if (isNaN(this.consumido) || isNaN(this.respaldo) || isNaN(this.id)) return false

        let query = `UPDATE CONSUMO_MEDICAMENTO `
        query += `SET CONSUMIDO=${this.consumido} `
        query += `, RESPALDO=${this.respaldo} `
        query += `, SINCRONIZADO=1 `
        query += `, USER_AT='${this.user_at}' `
        query += `WHERE ID=${this.id}; `

        return consultarDatabase(query)

    }
}