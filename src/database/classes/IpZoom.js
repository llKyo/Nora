import { consultarDatabase } from "../data-base.js";


export class IpZoom {

    constructor(id, ip = null, es_vigente = null, user_at = null) {
        this.id         = id;
        this.ip         = ip;
        this.es_vigente = es_vigente;
        this.user_at    = user_at;
    }

    consultarIpsVigentes() {
        const query =  `SELECT ID, IP, ES_VIGENTE, USER_AT FROM IP_ZOOM WHERE ES_VIGENTE = 1`;

        return consultarDatabase(query)
    }
}