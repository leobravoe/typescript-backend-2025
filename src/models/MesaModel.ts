import { DataBase } from "../database/DataBase";
import { IMesa } from "../interfaces/IMesa";

/**
 * Classe que representa uma Mesa e interage com o banco de dados.
 */
class MesaModel {
    id: number | null = null;
    numero: number | null = null;
    estado: string | null = null;
    dataAtualizacao: string | null = null;
    dataCriacao: string | null = null;

    /**
     * Construtor da classe `MesaModel`.
     * @param {IMesa} [mesa] - Objeto contendo os dados da mesa (opcional).
     */
    constructor(mesa?: IMesa) {
        Object.assign(this, mesa ?? {});
    }

    /**
     * Busca uma mesa no banco de dados pelo ID.
     * @param {number} id - ID da mesa a ser procurada.
     * @returns {Promise<MesaModel | null>} Retorna um objeto `MesaModel` se encontrado, ou null caso contrário.
     */
    static async findOne(id: number): Promise<MesaModel | null> {
        if (!id) return null;

        const result = await DataBase.executeSQLQuery(
            `SELECT * FROM Mesa WHERE id = ? LIMIT 1`,
            [id]
        );

        if(Array.isArray(result) && result.length === 1){
            return new MesaModel(result[0] as IMesa);
        }

        return null;
    }

    /**
     * Busca todas as mesas no banco de dados.
     * @returns {Promise<MesaModel[]>} Retorna um array de objetos `MesaModel`.
     */
    static async findAll(): Promise<MesaModel[]> {
        const result = await DataBase.executeSQLQuery(`SELECT * FROM Mesa`);

        // Verifica se o resultado é um array antes de continuar
        if (!Array.isArray(result)) return [] as MesaModel[];

        // Converte cada linha do banco em uma instância de `MesaModel`
        return result.map((mesa) => new MesaModel(mesa as IMesa));
    }

    /**
     * Insere um novo registro de mesa no banco de dados.
     * @returns {Promise<MesaModel | null>} Retorna um objeto `MesaModel` com os dados recém-inseridos ou null em caso de falha.
     */
    async save(): Promise<MesaModel | null> {
        if (!this.numero || !this.estado) throw new Error("Número e estado da mesa são obrigatórios.");

        const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");

        // Executa o INSERT e retorna o ID gerado
        const result = await DataBase.executeSQLQuery(
            `INSERT INTO Mesa (numero, estado, dataAtualizacao, dataCriacao) VALUES (?, ?, ?, ?);`,
            [this.numero, this.estado, timestamp, timestamp]
        );

        // Verifica se a inserção foi bem-sucedida
        if ("insertId" in result && result?.insertId) {
            return await MesaModel.findOne(result.insertId); // Retorna a mesa recém-criada
        }

        return null; // Retorna `null` se a inserção falhar
    }


    /**
     * Atualiza uma mesa no banco de dados.
     * @returns {Promise<MesaModel | null>} Retorna um objeto `MesaModel` com os dados atualizados.
     */
    async update(): Promise<MesaModel | null> {
        if (!this.id) throw new Error("ID da mesa não informado.");
        if (this.numero === null || this.estado === null) throw new Error("Número e estado da mesa são obrigatórios para atualização.");

        const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");

        // Executar a atualização
        const result = await DataBase.executeSQLQuery(
            `UPDATE Mesa SET numero = ?, estado = ?, dataAtualizacao = ? WHERE id = ?;`,
            [this.numero, this.estado, timestamp, this.id]
        );

        // Verificar se a atualização realmente aconteceu
        if ("affectedRows" in result && result.affectedRows > 0) {
            return await MesaModel.findOne(this.id);
        }

        return null;
    }


    /**
     * Remove uma mesa do banco de dados.
     * @returns {Promise<MesaModel | null>} Retorna a instância de `MesaModel` antes da remoção ou `null` se a mesa não existir.
     */
    async delete(): Promise<MesaModel | null> {
        if (!this.id) throw new Error("ID da mesa não informado.");

        // Busca a mesa antes da remoção para retornar seus dados
        const mesaRemovida = await MesaModel.findOne(this.id);
        if (!mesaRemovida) return null; // Retorna `null` se a mesa não existir

        const result = await DataBase.executeSQLQuery(`
            DELETE FROM Mesa WHERE id = ?`, 
            [this.id]
        );

        // Verificar se a atualização realmente aconteceu
        if ("affectedRows" in result && result.affectedRows > 0) {
            return mesaRemovida;
        }

        return null;
    }

}

export { MesaModel };
