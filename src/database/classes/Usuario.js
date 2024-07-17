import { consultarDatabase } from "../data-base.js";


export class Usuario {

    constructor(id = null, first_name = "", username = "", is_bot = null, r_usuario) {
        this.id         = id;
        this.first_name = first_name;
        this.username   = username;
        this.is_bot     = is_bot;
        this.r_usuario  = r_usuario ? r_usuario : id;
    }

    consultar() {
        const query =  `SELECT ID, NAME, USUERNAME, IS_BOT, R_USUARIO FROM USUARIO WHERE ID = ${this.id};`;

        return consultarDatabase(query)
    }

    registrar() {

        if (!this.first_name) this.first_name = ""
        if (!this.username) this.username = ""

        let query = `INSERT INTO USUARIO (ID, NAME, USERNAME, IS_BOT, R_USUARIO) VALUES`;
        query += `( ${this.id}`;
        query += `,'${this.first_name}'`;
        query += `,'${this.username}'`;
        query += `,'${this.is_bot ? 1 : 0}'`;
        query += `,'${this.r_usuario}'`;
        query += `);`;

        return consultarDatabase(query)
    }

    actualizar() {}

    eliminar() {}

    siExiste() {
        let query = `SELECT COUNT(1) FROM USUARIO `;
        query += `WHERE ID = ${this.id};`;

        return consultarDatabase(query)
    }

    registrarSiNoExiste(){
        return new Promise((resolve, reject) => {

            this.siExiste().then((result) => {

                if (result[0]["COUNT(1)"] == 0) {
                    this.registrar().then(res => resolve(true))
                } else{
                    resolve(false)
                }
            }).catch((err) => {
                reject(err)
            });
        })
    }
}