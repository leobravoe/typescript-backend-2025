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

export default IMesa;