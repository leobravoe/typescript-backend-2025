/**
 * Interface que define a estrutura de um objeto TipoProduto.
 * Representa um tipo de produto em um sistema de gerenciamento, 
 * contendo informações sobre seu identificador, descrição e datas de criação/atualização.
 *
 * @interface ITipoProduto
 * 
 * @property {number} [id] - Identificador único do tipo de produto (opcional).
 * @property {string} descricao - Descrição do tipo de produto.
 * @property {string} [dataAtualizacao] - Data da última atualização do tipo de produto (opcional).
 * @property {string} [dataCriacao] - Data de criação do tipo de produto (opcional).
 */
interface ITipoProduto {
    id?: number;
    descricao: string;
    dataAtualizacao?: string;
    dataCriacao?: string;
}

export { ITipoProduto };