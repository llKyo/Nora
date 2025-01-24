import { consultarDatabase } from "../data-base.js";

export class TipoCategoriaGasto {

    constructor(tipo = null, descripcion = null, es_vigente = null, user_at = null) {
        this.tipo           = tipo;
        this.descripcion    = descripcion;
        this.es_vigente     = es_vigente;
        this.user_at        = user_at;
    }

    obtenerCategoriasVigentes() {
        let query = `SELECT TIPO, DESCRIPCION FROM T_CATEGORIA_GASTO` 
        query += ` WHERE VIGENTE = 1`
    
        return consultarDatabase(query, 2)
    }
}