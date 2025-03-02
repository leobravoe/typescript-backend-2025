import "express-session";

declare module "express-session" {
    interface SessionData {
        message?: [string, string]; // Exemplo: ["success", "Operação realizada com sucesso."]
    }
}