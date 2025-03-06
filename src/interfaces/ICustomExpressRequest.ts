import { Request as ExpressRequest } from "express";
import { Session } from "express-session";

/**
 * Interface personalizada para estender o objeto `Request` do Express,
 * adicionando propriedades personalizadas à sessão do usuário.
 *
 * @interface ICustomExpressRequest
 * @extends {ExpressRequest}
 *
 * @property {Session & ICustomSession} session - Sessão do usuário, estendida com propriedades adicionais.
 */
interface ICustomExpressRequest extends ExpressRequest {
    session: Session & {
        /**
         * Mensagem temporária para feedback ao usuário.
         * O primeiro elemento representa o tipo da mensagem (ex: "success", "error"),
         * e o segundo contém o conteúdo da mensagem.
         * 
         * @example
         * req.session.message = ["success", "Operação realizada com sucesso."];
         */
        message?: [string, string];

        /**
         * Informações básicas do usuário autenticado.
         * Se o usuário estiver logado, contém ID, nome e e-mail.
         * Caso contrário, os valores serão `null`.
         *
         * @example
         * req.session.usuario = { id: 1, nome: "João", email: "joao@email.com" };
         */
        usuario?: { id: number | null; nome: string | null; email: string | null };
    };
}

export { ICustomExpressRequest };
