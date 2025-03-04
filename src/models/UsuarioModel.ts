import { DataBase } from "../database/DataBase";
import { IUsuario } from "../interfaces/IUsuario";
import crypto from "crypto";

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
     * Construtor da classe `UsuarioModel`.
     * @param {IUsuario} usuario - Objeto contendo os dados do usuário.
     */
    constructor(usuario?: IUsuario) {
        Object.assign(this, usuario ?? {});
    }

    /**
     * Busca um usuário no banco de dados pelo ID.
     * @param {number | null} id - ID do usuário a ser procurado.
     * @returns {Promise<UsuarioModel | null>} Retorna um objeto `UsuarioModel` se encontrado, ou null caso contrário.
     */
    static async findOne(id: number | null): Promise<UsuarioModel | null> {
        if (!id) return null;

        const result = await DataBase.executeSQLQuery(
            `SELECT * FROM Usuario WHERE id = ? LIMIT 1`,
            [id]
        );

        if(Array.isArray(result) && result.length === 1){
            return new UsuarioModel(result[0] as IUsuario);
        }

        return  null;
    }

    /**
     * Busca um usuário no banco de dados pelo email.
     * @param {string} email - Email do usuário a ser procurado.
     * @returns {Promise<UsuarioModel | null>} Retorna um objeto `UsuarioModel` se encontrado, ou null caso contrário.
     */
    static async findOneByEmail(email: string): Promise<UsuarioModel | null> {
        const normalizedEmail = email.trim().toLowerCase(); // 🔹 Normaliza o e-mail antes da busca
        const result = await DataBase.executeSQLQuery(
            `SELECT * FROM Usuario WHERE email = ? LIMIT 1`,
            [normalizedEmail]
        );

        // Verifica se `result` é um array e se há registros
        if (Array.isArray(result) && result.length > 0) {
            return new UsuarioModel(result[0] as IUsuario);
        }

        return null;
    }


    /**
     * Busca todos os usuários no banco de dados.
     * @returns {Promise<UsuarioModel[]>} Retorna um array de objetos `UsuarioModel`.
     */
    static async findAll(): Promise<UsuarioModel[]> {
        const result = await DataBase.executeSQLQuery(`SELECT * FROM Usuario ORDER BY id ASC`);

        // Verifica se o resultado é um array antes de continuar
        if (!Array.isArray(result)) return [] as UsuarioModel[];

        // Converte cada linha do banco em uma instância de `UsuarioModel`
        return result.map((usuario) => new UsuarioModel(usuario as IUsuario));
    }

    /**
     * Valida um usuário pelo e-mail e senha.
     * @param {string} email - O e-mail do usuário.
     * @param {string} senha - A senha do usuário.
     * @returns {Promise<UsuarioModel | null>} Retorna um objeto `UsuarioModel` se a validação for bem-sucedida, caso contrário, retorna `null`.
     */
    static async validateUser(email: string, senha: string): Promise<UsuarioModel | null> {
        if (!email || !senha) throw new Error("Email e senha são obrigatórios.");

        // Consulta otimizada com `LIMIT 1`
        const result = await DataBase.executeSQLQuery(
            `SELECT * FROM Usuario WHERE email = ? LIMIT 1`,
            [email]
        );

        // Verifica se um usuário foi encontrado
        if (!Array.isArray(result) || result.length === 0) return null;

        const usuario = result[0] as IUsuario;
        const senhaHash = crypto.createHash("sha512").update(senha + email).digest("hex");

        // Valida a senha antes de retornar o usuário
        if (usuario.senha !== senhaHash) return null;

        return new UsuarioModel(usuario);
    }


    /**
     * Insere um novo usuário no banco de dados.
     * @returns {Promise<UsuarioModel | null>} Retorna o `UsuarioModel` com os dados recém-inseridos ou `null` se a inserção falhar.
     */
    async save(): Promise<UsuarioModel | null> {
        if (!this.nome) throw new Error("Nome do usuário não pode ser vazio.");
        if (!this.senha || !this.email) throw new Error("Email e senha são obrigatórios.");

        const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
        const senhaHash = crypto.createHash("sha512").update(this.senha + this.email).digest("hex");

        // Executa o INSERT e retorna o ID gerado
        const result = await DataBase.executeSQLQuery(
            `INSERT INTO Usuario (nome, email, senha, dataAtualizacao, dataCriacao) VALUES (?, ?, ?, ?, ?);`,
            [this.nome, this.email, senhaHash, timestamp, timestamp]
        );

        // Verifica se a inserção foi bem-sucedida
        if ("insertId" in result && result.insertId) {
            return await UsuarioModel.findOne(result.insertId); // Retorna o usuário recém-criado
        }

        return null; // Retorna `null` se a inserção falhar
    }


    /**
     * Atualiza um usuário no banco de dados.
     * @returns {Promise<UsuarioModel | null>} Retorna o `UsuarioModel` atualizado, ou `null` se a atualização falhar.
     */
    async update(): Promise<UsuarioModel | null> {
        if (!this.id) throw new Error("ID do usuário não informado.");
        if (!this.nome) throw new Error("Nome do usuário não pode ser vazio.");

        const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");

        // Executar a atualização
        const result = await DataBase.executeSQLQuery(
            `UPDATE Usuario SET nome = ?, dataAtualizacao = ? WHERE id = ?;`,
            [this.nome, timestamp, this.id]
        );

        // Verificar se a atualização realmente aconteceu
        if ("affectedRows" in result && result.affectedRows > 0) {
            return await UsuarioModel.findOne(this.id); // Retorna o usuário atualizado
        }

        return null;
    }


    /**
     * Atualiza o e-mail e a senha do usuário.
     * @returns {Promise<UsuarioModel | null>} Retorna o `UsuarioModel` atualizado, ou `null` se a atualização falhar.
    */
    async updateEmailPassword(): Promise<UsuarioModel | null> {
        if (!this.id) throw new Error("ID do usuário não informado.");
        if (!this.senha || !this.email) return null;

        // Gerar hash da senha
        this.senha = crypto.createHash("sha512").update(this.senha + this.email).digest("hex");

        // Atualizar a data
        const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");

        // Executar a atualização
        const result = await DataBase.executeSQLQuery(
            `UPDATE Usuario SET email = ?, senha = ?, dataAtualizacao = ? WHERE id = ?;`,
            [this.email, this.senha, timestamp, this.id]
        );

        // Verificar se a atualização realmente aconteceu
        if ("affectedRows" in result && result.affectedRows > 0) {
            return await UsuarioModel.findOne(this.id); // Retorna o usuário atualizado
        }

        return null;
    }

    /**
    * Remove um usuário do banco de dados.
    * @returns {Promise<UsuarioModel | null>} Retorna o `UsuarioModel` removido se a remoção for bem-sucedida, `null` caso contrário.
    */
    async delete(): Promise<UsuarioModel | null> {
        if (!this.id) throw new Error("ID do usuário não informado.");

        // Buscar o usuário antes de remover
        const usuarioRemovido = await UsuarioModel.findOne(this.id);
        if (!usuarioRemovido) return null; // Se não existir, já retorna null

        // Executar a remoção
        const result = await DataBase.executeSQLQuery(`DELETE FROM Usuario WHERE id = ?`, [this.id]);

        // Verificar se realmente foi deletado
        if ("affectedRows" in result && result.affectedRows > 0) {
            return usuarioRemovido; // Retorna o usuário removido
        }

        return null;
    }
}

export default UsuarioModel;