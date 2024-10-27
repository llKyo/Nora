import { consultarDatabase } from "../data-base.js";


export class IpZoom {

    constructor(id, ip = null, vigente = null, r_usuario = null) {
        this.id         = id;
        this.ip         = ip;
        this.vigente    = vigente;
        this.r_usuario  = r_usuario;
    }

    consultarIpsVigentes() {
        const query =  `SELECT ID, IP, ES_VIGENTE, USER_AT FROM IP_ZOOM WHERE ES_VIGENTE = 1`;

        return consultarDatabase(query)
    }
}