/**
 * Interface que define a estrutura de um objeto Mesa.
 * Representa uma mesa em um sistema de gerenciamento, contendo
 * informações sobre seu identificador, número, estado e datas de criação/atualização.
 *
 * @interface IMesa
 * 
 * @property {number} [id] - Identificador único da mesa (opcional).
 * @property {number} numero - Número da mesa.
 * @property {string} estado - Estado atual da mesa (ex: "disponível", "ocupada").
 * @property {string} [dataAtualizacao] - Data da última atualização da mesa (opcional).
 * @property {string} [dataCriacao] - Data de criação da mesa (opcional).
 */
interface IMesa {
    id?: number;
    numero: number;
    estado: string;
    dataAtualizacao?: string;
    dataCriacao?: string;
}

export { IMesa };
