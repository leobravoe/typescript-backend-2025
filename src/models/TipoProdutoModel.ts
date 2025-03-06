import { DataBase } from "../database/DataBase";
import { ITipoProduto } from "../interfaces/entities/ITipoProduto";

/**
 * Classe que representa um TipoProduto e interage com o banco de dados.
 */
class TipoProdutoModel {
    id: number | null = null;
    descricao: string | null = null;
    dataAtualizacao: string | null = null;
    dataCriacao: string | null = null;

    /**
     * Construtor da classe `TipoProdutoModel`.
     * @param {ITipoProduto} [tipoProduto] - Objeto contendo os dados do TipoProduto (opcional).
     */
    constructor(tipoProduto?: ITipoProduto) {
        Object.assign(this, tipoProduto ?? {});
    }

    /**
     * Busca uma TipoProduto no banco de dados pelo ID.
     * @param {number} id - ID da TipoProduto a ser procurada.
     * @returns {Promise<TipoProdutoModel | null>} Retorna um objeto `TipoProdutoModel` se encontrado, ou null caso contrário.
     */
    static async findOne(id: number): Promise<TipoProdutoModel | null> {
        if (!id) return null;

        const result = await DataBase.executeSQLQuery(
            "SELECT * FROM TipoProduto WHERE TipoProduto.id = ?",
            [id]
        );

        if (Array.isArray(result) && result.length === 1) {
            return new TipoProdutoModel(result[0] as ITipoProduto);
        }

        return null;
    }

    /**
     * Busca todas as TiposProdutos no banco de dados.
     * @returns {Promise<TipoProdutoModel[]>} Retorna um array de objetos `TipoProdutoModel`.
     */
    static async findAll(): Promise<TipoProdutoModel[]> {
        const result = await DataBase.executeSQLQuery("SELECT * FROM TipoProduto");

        // Verifica se o resultado é um array antes de continuar
        if (!Array.isArray(result)) return [] as TipoProdutoModel[];

        // Converte cada linha do banco em uma instância de `TipoProdutoModel`
        return result.map((tipoProduto) => new TipoProdutoModel(tipoProduto as ITipoProduto));
    }

    /**
     * Insere um novo registro de TipoProduto no banco de dados.
     * @returns {Promise<TipoProdutoModel | null>} Retorna um objeto `TipoProdutoModel` com os dados recém-inseridos ou null em caso de falha.
     */
    async save(): Promise<TipoProdutoModel | null> {
        if (!this.descricao) throw new Error("Descrição do TipoProduto é obrigatório.");

        const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");

        // Executa o INSERT e retorna o ID gerado
        const result = await DataBase.executeSQLQuery(
            "INSERT INTO TipoProduto (descricao, dataAtualizacao, dataCriacao) VALUES (?, ?, ?);",
            [this.descricao, timestamp, timestamp]
        );

        // Verifica se a inserção foi bem-sucedida
        if ("insertId" in result && result?.insertId) {
            return await TipoProdutoModel.findOne(result.insertId); // Retorna a TipoProduto recém-criado
        }

        return null; // Retorna `null` se a inserção falhar
    }

    /**
     * Atualiza um TipoProduto no banco de dados.
     * @returns {Promise<TipoProdutoModel | null>} Retorna um objeto `TipoProdutoModel` com os dados atualizados.
     */
    async update(): Promise<TipoProdutoModel | null> {
        if (!this.id) throw new Error("ID do TipoProduto não informado.");
        if (!this.descricao) throw new Error("Descrição do TipoProduto é obrigatório.");

        const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
        
        // Executar a atualização
        const result = await DataBase.executeSQLQuery(
            "UPDATE TipoProduto SET descricao = ?, dataAtualizacao = ? WHERE id = ?",
            [this.descricao, timestamp, this.id]
        );
        
        // Verificar se a atualização realmente aconteceu
        if ("affectedRows" in result && result.affectedRows > 0) {
            return await TipoProdutoModel.findOne(this.id);
        }

        return null;
    }

    /**
     * Remove uma TipoProduto do banco de dados.
     * @returns {Promise<TipoProdutoModel | null>} Retorna a instância de `TipoProdutoModel` antes da remoção ou `null` se a mesa não existir.
     */
    async delete(): Promise<TipoProdutoModel> {
        if (!this.id) throw new Error("ID do TipoProduto não informado.");
        
        await DataBase.executeSQLQuery("DELETE FROM TipoProduto WHERE id = ?", [this.id]);
        return this;
    }
}

export { TipoProdutoModel, ITipoProduto };