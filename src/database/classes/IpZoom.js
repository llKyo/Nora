import { consultarDatabase } from "../data-base.js";


export class IpZoom {

    constructor(id, ip = null, vigente = null, user_at = null) {
        this.id         = id;
        this.ip         = ip;
        this.vigente    = vigente;
        this.user_at    = user_at;
    }

    consultarIpsVigentes() {
        const query =  `SELECT ID, IP, VIGENTE, USER_AT FROM IP_ZOOM WHERE VIGENTE = 1`;

        return consultarDatabase(query)
    }
}