import { BaseModel } from "./BaseModel";
import { DataBase } from "../database/DataBase";
import { IUsuario } from "../interfaces/entities/IUsuario";
import crypto from "crypto";

class UsuarioModel extends BaseModel {
    static tableName = "Usuario";

    id: number | null = null;
    nome: string | null = null;
    email: string | null = null;
    senha: string | null = null;
    dataAtualizacao: string | null = null;
    dataCriacao: string | null = null;

    constructor(usuario?: IUsuario) {
        super(usuario);
        // Inicializa as propriedades apenas se não foram definidas pelo super()
        if (usuario) {
            this.id = usuario.id ?? null;
            this.nome = usuario.nome ?? null;
            this.email = usuario.email ?? null;
            this.senha = usuario.senha ?? null;
            this.dataAtualizacao = usuario.dataAtualizacao ?? null;
            this.dataCriacao = usuario.dataCriacao ?? null;
        }
    }

    // --- Hooks: sem mudar a assinatura de save/update ---
    protected async beforeSave(): Promise<void> {
        await this._hashPasswordIfNeeded();
    }

    protected async beforeUpdate(): Promise<void> {
        await this._hashPasswordIfNeeded();
    }

    private async _hashPasswordIfNeeded(): Promise<void> {
        if (this.senha && this.email) {
            const emailNorm = this.email.trim();
            this.senha = crypto.createHash("sha512").update(this.senha + emailNorm).digest("hex");
            this.email = emailNorm;
        }
    }

    // --- Login específico ---
    static async findByEmailAndPassword(email: string, senha: string): Promise<UsuarioModel | null> {
        if (!email || !senha) return null;

        const res: any = await DataBase.executeSQLQuery(
            `SELECT * FROM ${this.tableName} WHERE email = ? LIMIT 1`,
            [email.trim()]
        );

        // Normaliza possíveis formatos de retorno do mysql2/promise
        const rows: any[] = Array.isArray(res) && Array.isArray(res[0]) ? res[0] : res;
        if (!Array.isArray(rows) || rows.length === 0) return null;

        const usuario = new UsuarioModel(rows[0] as IUsuario);
        const senhaHash = crypto.createHash("sha512").update(senha + email.trim()).digest("hex");
        if (usuario.senha !== senhaHash) return null;

        return usuario;
    }

    // --- Métodos adicionais necessários ---

    /**
     * Encontra um usuário pelo email
     */
    static async findOneByEmail(email: string): Promise<UsuarioModel | null> {
        if (!email) return null;

        const res: any = await DataBase.executeSQLQuery(
            `SELECT * FROM ${this.tableName} WHERE email = ? LIMIT 1`,
            [email.trim()]
        );

        // Normaliza possíveis formatos de retorno do mysql2/promise
        const rows: any[] = Array.isArray(res) && Array.isArray(res[0]) ? res[0] : res;
        if (!Array.isArray(rows) || rows.length === 0) return null;

        return new UsuarioModel(rows[0] as IUsuario);
    }

    /**
     * Valida as credenciais do usuário para login
     */
    static async validateUser(email: string, senha: string): Promise<UsuarioModel | null> {
        return this.findByEmailAndPassword(email, senha);
    }

    /**
     * Atualiza o email e senha do usuário
     */
    async updateEmailPassword(): Promise<void> {
        if (!this.id) {
            throw new Error("Usuário não possui ID para atualização");
        }

        // Hash da senha antes de atualizar
        await this._hashPasswordIfNeeded();

        await DataBase.executeSQLQuery(
            `UPDATE ${UsuarioModel.tableName} SET email = ?, senha = ?, dataAtualizacao = NOW() WHERE id = ?`,
            [this.email, this.senha, this.id]
        );
    }
}

export { UsuarioModel };
