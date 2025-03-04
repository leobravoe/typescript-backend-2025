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

export default IUsuario;