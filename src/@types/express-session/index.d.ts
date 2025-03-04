import "express-session";

/**
 * Extende a interface `SessionData` do módulo `express-session`
 * para incluir um campo `message`. Esse campo pode armazenar uma 
 * mensagem temporária de feedback para o usuário, geralmente usada 
 * em redirecionamentos.
 * 
 * @example
 * req.session.message = ["success", "Operação realizada com sucesso."];
 */
declare module "express-session" {
    interface SessionData {
        /**
         * Mensagem de feedback temporária para exibição ao usuário.
         * O primeiro elemento representa o tipo (ex: "success", "error"),
         * e o segundo contém a mensagem.
         */
        message?: [string, string];
    }
}
