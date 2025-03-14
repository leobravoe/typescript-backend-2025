/**
 * Interface que define a estrutura de um objeto Produto.
 * Representa um produto em um sistema de gerenciamento, contendo
 * informações sobre seu identificador, nome, preço, tipo de produto, 
 * ingredientes e datas de criação/atualização.
 *
 * @interface IProduto
 * 
 * @property {number} [id] - Identificador único do produto (opcional).
 * @property {number} numero - Número do produto.
 * @property {string} nome - Nome do produto.
 * @property {number} preco - Preço do produto.
 * @property {number} TipoProduto_id - Identificador do tipo de produto associado.
 * @property {string} ingredientes - Lista de ingredientes do produto.
 * @property {string} [dataAtualizacao] - Data da última atualização do produto (opcional).
 * @property {string} [dataCriacao] - Data de criação do produto (opcional).
 */
interface IProduto {
    id?: number;
    numero: number;
    nome: string;
    preco: number;
    TipoProduto_id: number;
    ingredientes: string;
    dataAtualizacao?: string;
    dataCriacao?: string;
}

export { IProduto };