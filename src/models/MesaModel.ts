import DataBase from "../database/DataBase";

/**
 * Interface que define a estrutura de um objeto Mesa.
 */
interface IMesa {
    id?: number;
    numero: number;
    estado: string;
    dataAtualizacao?: string;
    dataCriacao?: string;
}

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
     * Construtor da classe MesaModel.
     * @param {IMesa} mesa - Objeto contendo os dados da mesa. Caso não seja informado, um objeto vazio será criado.
     */
    constructor(mesa?: IMesa) {
        if (mesa) {
            this.id = mesa.id ?? null;
            this.numero = mesa.numero;
            this.estado = mesa.estado;
            this.dataAtualizacao = mesa.dataAtualizacao ?? null;
            this.dataCriacao = mesa.dataCriacao ?? null;
        }
    }

    /**
     * Busca uma mesa no banco de dados pelo ID.
     * @param {number} id - ID da mesa a ser procurada.
     * @returns {Promise<MesaModel | null>} Retorna um objeto MesaModel se encontrado, ou null caso contrário.
     */
    static async findOne(id: number): Promise<MesaModel | null> {
        const result = await DataBase.executeSQLQuery(`SELECT * FROM Mesa WHERE id = ?`, [id]);
        return result?.length ? new MesaModel(result[0] as IMesa) : null;
    }

    /**
     * Busca todas as mesas registradas no banco de dados.
     * @returns {Promise<MesaModel[]>} Retorna um array de objetos MesaModel.
     */
    static async findAll(): Promise<MesaModel[]> {
        const result = await DataBase.executeSQLQuery(`SELECT * FROM Mesa`);
        return (result as IMesa[]).map((mesa) => new MesaModel(mesa));
    }

    /**
     * Insere um novo registro de mesa no banco de dados.
     * @returns {Promise<MesaModel> | null} Retorna um objeto MesaModel com os dados recém-inseridos.
     */
    async save(): Promise<MesaModel | null> {
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const result = await DataBase.executeSQLQuery(
            `INSERT INTO Mesa (numero, estado, dataAtualizacao, dataCriacao) VALUES (?, ?, ?, ?);`,
            [this.numero, this.estado, timestamp, timestamp]
        );
        console.log(result)
        return MesaModel.findOne(1);
    }

    /**
     * Atualiza um registro de mesa no banco de dados.
     * @returns {Promise<MesaModel | null>} Retorna um objeto MesaModel com os dados atualizados.
     */
    async update(): Promise<MesaModel | null> {
        if (!this.id) throw new Error("ID da mesa não informado.");
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        await DataBase.executeSQLQuery(
            `UPDATE Mesa SET numero = ?, estado = ?, dataAtualizacao = ? WHERE id = ?;`,
            [this.numero, this.estado, timestamp, this.id]
        );
        return await MesaModel.findOne(this.id);
    }

    /**
     * Remove um registro de mesa do banco de dados.
     * @returns {Promise<MesaModel | null>} Retorna `true` se a remoção for bem-sucedida, `false` caso contrário.
     */
    async delete(): Promise<MesaModel | null> {
        if (!this.id) throw new Error("ID da mesa não informado.");
        const result = await DataBase.executeSQLQuery(`DELETE FROM Mesa WHERE id = ?`, [this.id]);
        console.log(result)
        return await MesaModel.findOne(1);
    }
}

export default MesaModel;
