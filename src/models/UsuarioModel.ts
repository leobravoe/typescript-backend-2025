import DataBase from "../database/DataBase";
import crypto from "crypto";

/**
 * Interface que define a estrutura de um objeto Usuario.
 */
interface IUsuario {
    id?: number;
    nome: string;
    email: string;
    senha: string;
    dataAtualizacao?: string;
    dataCriacao?: string;
}

/**
 * Classe que representa um Usuario e interage com o banco de dados.
 */
class UsuarioModel {
    id: number | null = null;
    nome: string | null = null;
    email: string | null = null;
    senha: string | null = null;
    dataAtualizacao: string | null = null;
    dataCriacao: string | null = null;

    /**
     * Construtor da classe UsuarioModel.
     * @param {IUsuario} usuario - Objeto contendo os dados do usuário.
     */
    constructor(usuario?: IUsuario) {
        if (usuario) {
            this.id = usuario.id ?? null;
            this.nome = usuario.nome;
            this.email = usuario.email;
            this.senha = usuario.senha;
            this.dataAtualizacao = usuario.dataAtualizacao ?? null;
            this.dataCriacao = usuario.dataCriacao ?? null;
        }
    }

    /**
     * Busca um usuário no banco de dados pelo ID.
     * @param {number} id - ID do usuário a ser procurado.
     * @returns {Promise<UsuarioModel | null>} Retorna um objeto UsuarioModel se encontrado, ou null caso contrário.
     */
    static async findOne(id: number | null): Promise<UsuarioModel | null> {
        if(!id)
            return null;
        const result = await DataBase.executeSQLQuery(`SELECT * FROM Usuario WHERE id = ?`, [id]);
        return result?.length ? new UsuarioModel(result[0] as IUsuario) : null;
    }

    /**
     * Busca um usuário no banco de dados pelo email.
     * @param {string} email - Email do usuário a ser procurado.
     * @returns {Promise<UsuarioModel | null>} Retorna um objeto UsuarioModel se encontrado, ou null caso contrário.
     */
    static async findOneByEmail(email: string): Promise<UsuarioModel | null> {
        const result = await DataBase.executeSQLQuery(`SELECT * FROM Usuario WHERE email = ?`, [email]);
        return result?.length ? new UsuarioModel(result[0] as IUsuario) : null;
    }

    /**
     * Busca todos os usuários no banco de dados.
     * @returns {Promise<UsuarioModel[]>} Retorna um array de objetos UsuarioModel.
     */
    static async findAll(): Promise<UsuarioModel[]> {
        const result = await DataBase.executeSQLQuery(`SELECT * FROM Usuario`);
        return (result as IUsuario[]).map((usuario) => new UsuarioModel(usuario));
    }

    /**
     * Valida um usuário pelo e-mail e senha.
     * @param {string} email - O e-mail do usuário.
     * @param {string} senha - A senha do usuário.
     * @returns {Promise<UsuarioModel | null>} Retorna um objeto UsuarioModel se a validação for bem-sucedida, caso contrário, retorna null.
     */
    static async validateUser(email: string, senha: string): Promise<UsuarioModel | null> {
        const result = await DataBase.executeSQLQuery(`SELECT * FROM Usuario WHERE email = ?`, [email]);
        if (result?.length) {
            const usuario = result[0] as IUsuario;
            const senhaHash = crypto.createHash("sha512").update(senha + email).digest("hex");
            if (usuario.senha === senhaHash) {
                return new UsuarioModel(usuario);
            }
        }
        return null;
    }

    /**
     * Insere um novo usuário no banco de dados.
     * @returns {Promise<UsuarioModel | null>} Retorna um objeto UsuarioModel com os dados recém-inseridos.
     */
    async save(): Promise<UsuarioModel | null> {
        const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
        if(!this.senha || !this.email)
            return null;
        const senhaHash = crypto.createHash("sha512").update(this.senha + this.email).digest("hex");
        const result = await DataBase.executeSQLQuery(
            `INSERT INTO Usuario (nome, email, senha, dataAtualizacao, dataCriacao) VALUES (?, ?, ?, ?, ?);`,
            [this.nome, this.email, senhaHash, timestamp, timestamp]
        );
        console.log(result);
        return UsuarioModel.findOne(1);
    }

    /**
     * Atualiza um usuário no banco de dados.
     * @returns {Promise<UsuarioModel | null>} Retorna um objeto UsuarioModel atualizado.
     */
    async update(): Promise<UsuarioModel | null> {
        if (!this.id) throw new Error("ID do usuário não informado.");
        const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
        await DataBase.executeSQLQuery(
            `UPDATE Usuario SET nome = ?, dataAtualizacao = ? WHERE id = ?;`,
            [this.nome, timestamp, this.id]
        );
        return await UsuarioModel.findOne(this.id);
    }

    /**
     * Atualiza o e-mail e a senha do usuário.
     * @returns {Promise<UsuarioModel | null>} Retorna um objeto UsuarioModel atualizado.
     */
    async updateEmailPassword(): Promise<UsuarioModel | null> {
        if (!this.id) throw new Error("ID do usuário não informado.");
        const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
        if(!this.senha || !this.email)
            return null;
        const senhaHash = crypto.createHash("sha512").update(this.senha + this.email).digest("hex");
        await DataBase.executeSQLQuery(
            `UPDATE Usuario SET email = ?, senha = ?, dataAtualizacao = ? WHERE id = ?;`,
            [this.email, senhaHash, timestamp, this.id]
        );
        return await UsuarioModel.findOne(this.id);
    }

    /**
     * Remove um usuário do banco de dados.
     * @returns {Promise<Promise<UsuarioModel | null>} Retorna `true` se a remoção for bem-sucedida, `false` caso contrário.
     */
    async delete(): Promise<UsuarioModel | null> {
        if (!this.id) throw new Error("ID do usuário não informado.");
        const result = await DataBase.executeSQLQuery(`DELETE FROM Usuario WHERE id = ?`, [this.id]);
        console.log(result);
        return UsuarioModel.findOne(1);
    }
}

export default UsuarioModel;