import { consultarDatabase } from "../data-base.js";


export class Medicamento {

    constructor(id, nombre = null, vigente = null, r_usuario = null) {
        this.id         = id;
        this.nombre     = nombre;
        this.vigente    = vigente;
        this.r_usuario  = r_usuario;
    }

    obtenerMedicCompradosVigentes(){

        let query = 'SELECT ID, NOMBRE, DOSIS_DIARIA, COMPRADO FROM V_MEDIC_COMPRADOS_VIG'

        return consultarDatabase(query)
    }

    obtenerMedicConsumAcum(){

        let query = 'SELECT ID_MEDICAMENTO, FECHA, ACUMULADO FROM V_MEDIC_CONSUM_ACUM'

        return consultarDatabase(query)
    }

    obtenerMedicConsumidos(){

        let query = 'SELECT ID, NOMBRE, CONSUMIDO FROM V_MEDIC_CONSUMIDO_VIG'

        return consultarDatabase(query)
    }

    obtenerMedicConsumidos(){

        let query = 'SELECT ID, NOMBRE, CONSUMIDO FROM V_MEDIC_CONSUMIDO_VIG'

        return consultarDatabase(query)
    }
}