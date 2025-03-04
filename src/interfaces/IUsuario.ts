/**
 * Interface que define a estrutura de um objeto Usuário.
 * Representa um usuário no sistema, contendo informações essenciais
 * como nome, e-mail, senha e datas de criação/atualização.
 *
 * @interface IUsuario
 * 
 * @property {number} [id] - Identificador único do usuário (opcional).
 * @property {string} nome - Nome do usuário.
 * @property {string} email - Endereço de e-mail do usuário.
 * @property {string} senha - Senha do usuário (geralmente armazenada de forma segura).
 * @property {string} [dataAtualizacao] - Data da última atualização do usuário (opcional).
 * @property {string} [dataCriacao] - Data de criação do usuário (opcional).
 */
interface IUsuario {
    id?: number;
    nome: string;
    email: string;
    senha: string;
    dataAtualizacao?: string;
    dataCriacao?: string;
}

export { IUsuario };
