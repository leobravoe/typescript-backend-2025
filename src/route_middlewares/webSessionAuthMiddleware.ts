import { Request, Response, NextFunction } from "express";
import session from "express-session"; // Importação correta para os tipos da sessão

// Definição da interface para a sessão do usuário
interface AuthenticatedSession extends session.Session {
    usuario?: any; // Substitua "any" pelo tipo correto do usuário, se disponível
    message?: [string, string];
}

// Interface personalizada para garantir que req.session tenha o tipo correto
interface AuthenticatedRequest extends Request {
    session: AuthenticatedSession;
}

const webSessionAuthMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (req.session && req.session.usuario) {
        // Usuário autenticado, permitir acesso
        return next();
    } else {
        // Redirecionar para a página de login
        req.session.message = ["danger", "Você precisa estar autenticado para acessar esta página."];
        return res.redirect("/usuario");
    }
};

export default webSessionAuthMiddleware;
