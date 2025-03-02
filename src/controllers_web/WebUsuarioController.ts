import { Request as ExpressRequest, Response } from "express";
import UsuarioModel from "../models/UsuarioModel";
import { Session } from "express-session";

interface Request extends ExpressRequest {
    session: Session & {
        message?: [string, string];
        usuario?: { id: number | null; nome: string | null; email: string | null };
    };
}

class WebUsuarioController {
    async index(req: Request, res: Response): Promise<void> {
        try {
            const message = req.session.message || null;
            if (message) delete req.session.message;
            const usuarioLogado = req.session.usuario || null;
            const usuario = usuarioLogado ? await UsuarioModel.findOne(usuarioLogado.id) : null;

            return res.render("usuario/index", {
                layout: "layouts/main",
                title: "Painel de Usuário",
                usuario,
                message,
                csrfToken: req.csrfToken()
            });
        } catch (error) {
            return res.render("usuario/index", {
                layout: "layouts/main",
                title: "Lista de Usuários",
                usuario: null,
                message: ["danger", JSON.stringify(error)]
            });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            return res.render("usuario/create", {
                layout: "layouts/main",
                title: "Criar Usuário",
                csrfToken: req.csrfToken()
            });
        } catch (error) {
            req.session.message = ["danger", JSON.stringify(error)];
        }
        return res.redirect("/usuario");
    }

    async store(req: Request, res: Response): Promise<void> {
        try {
            const { nome, email, senha } = req.body;

            if (!nome || !email || !senha) {
                req.session.message = ["warning", "Todos os campos são obrigatórios."];
                return res.redirect("/usuario");
            }

            const usuarioExistente = await UsuarioModel.findOneByEmail(email);
            if (usuarioExistente) {
                req.session.message = ["warning", "E-mail já cadastrado."];
                return res.redirect("/usuario");
            }

            const usuario = new UsuarioModel({ nome, email, senha });
            await usuario.save();
            req.session.message = ["success", "Usuário cadastrado com sucesso."];
        } catch (error) {
            req.session.message = ["danger", JSON.stringify(error)];
        }
        return res.redirect("/usuario");
    }

    async show(req: Request, res: Response): Promise<void> {
        try {
            const usuario = await UsuarioModel.findOne(Number(req.params.id));
            if (usuario) {
                return res.render("usuario/show", {
                    layout: "layouts/main",
                    title: "Detalhes do Usuário",
                    usuario
                });
            }
            req.session.message = ["warning", "Usuário não encontrado."];
        } catch (error) {
            req.session.message = ["danger", JSON.stringify(error)];
        }
        return res.redirect("/usuario");
    }

    async edit(req: Request, res: Response): Promise<void> {
        try {
            const usuario = await UsuarioModel.findOne(Number(req.params.id));
            if (usuario) {
                return res.render("usuario/edit", {
                    layout: "layouts/main",
                    title: "Editar Usuário",
                    usuario,
                    csrfToken: req.csrfToken()
                });
            }
            req.session.message = ["warning", "Usuário não encontrado."];
        } catch (error) {
            req.session.message = ["danger", JSON.stringify(error)];
        }
        return res.redirect("/usuario");
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const usuario = await UsuarioModel.findOne(Number(req.params.id));
            if (!usuario) {
                req.session.message = ["warning", "Usuário não encontrado."];
                return res.redirect("/usuario");
            }

            usuario.nome = req.body.nome;
            await usuario.update();

            req.session.usuario = { id: usuario.id, nome: usuario.nome, email: usuario.email };
            req.session.message = ["success", "Usuário atualizado com sucesso."];
        } catch (error) {
            req.session.message = ["danger", JSON.stringify(error)];
        }
        return res.redirect("/usuario");
    }

    async destroy(req: Request, res: Response): Promise<void> {
        try {
            const usuario = await UsuarioModel.findOne(Number(req.params.id));
            if (!usuario) {
                req.session.message = ["warning", "Usuário não encontrado."];
                return res.redirect("/usuario");
            }
            await usuario.delete();
            req.session.message = ["success", "Usuário removido com sucesso."];
        } catch (error) {
            req.session.message = ["danger", JSON.stringify(error)];
        }
        return res.redirect("/usuario");
    }

    async loginForm(req: Request, res: Response): Promise<void> {
        try {
            return res.render("usuario/login", {
                layout: "layouts/main",
                title: "Login de usuário",
                csrfToken: req.csrfToken()
            });
        } catch (error) {
            req.session.message = ["danger", JSON.stringify(error)];
        }
        return res.redirect("/usuario");
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, senha } = req.body;
            if (!email || !senha) {
                req.session.message = ["warning", "E-mail e senha são obrigatórios."];
                return res.redirect("/usuario");
            }

            const usuario = await UsuarioModel.validateUser(email, senha);
            if (!usuario) {
                req.session.message = ["danger", "E-mail ou senha inválidos."];
                return res.redirect("/usuario");
            }

            req.session.usuario = { id: usuario.id, nome: usuario.nome, email: usuario.email };
            req.session.message = ["success", `Bem-vindo, ${usuario.nome}!`];
        } catch (error) {
            req.session.message = ["danger", JSON.stringify(error)];
        }
        return res.redirect("/usuario");
    }

    async logout(req: Request, res: Response): Promise<void> {
        try {
            req.session.message = ["success", "Usuário desautenticado."];
            delete req.session.usuario;
        } catch (error) {
            req.session.message = ["danger", JSON.stringify(error)];
        }
        return res.redirect("/usuario");
    }

    /**
     * Mostra o formulário de alteração de e-mail e senha.
     */
    async editEmailPassword(req: Request, res: Response): Promise<void> {
        try {
            if (!req.session.usuario) {
                req.session.message = ["warning", "Você precisa estar logado para alterar seu e-mail e senha."];
                return res.redirect("/usuario/login");
            }
            const usuario = await UsuarioModel.findOne(Number(req.params.id));
            if (!usuario) {
                req.session.message = ["warning", "Usuário não encontrado."];
                return res.redirect("/usuario/login");
            }
            return res.render("usuario/editEmailPassword", {
                layout: "layouts/main",
                title: "Alterar E-mail e Senha",
                usuario,
                csrfToken: req.csrfToken(),
            });
        } catch (error) {
            req.session.message = ["danger", JSON.stringify(error)];
            return res.redirect("/usuario");
        }
    }

    /**
     * Atualiza o e-mail e a senha do usuário.
     */
    async updateEmailPassword(req: Request, res: Response): Promise<void> {
        try {
            if (!req.session.usuario) {
                req.session.message = ["warning", "Você precisa estar logado para alterar seu e-mail e senha."];
                return res.redirect("/usuario/login");
            }
            
            const { email, senha } = req.body;
            if (!email || !senha) {
                req.session.message = ["warning", "E-mail e senha são obrigatórios."];
                return res.redirect("/usuario/editEmailPassword");
            }

            const usuario = await UsuarioModel.findOne(req.session.usuario.id);
            if (!usuario) {
                req.session.message = ["danger", "Usuário não encontrado."];
                return res.redirect("/usuario");
            }

            usuario.email = email;
            usuario.senha = senha;
            await usuario.updateEmailPassword();

            req.session.usuario.email = email;
            req.session.message = ["success", "E-mail e senha alterados com sucesso."];
            return res.redirect("/usuario");
        } catch (error) {
            req.session.message = ["danger", JSON.stringify(error)];
        }
        return res.redirect("/usuario");
    }
}

export default new WebUsuarioController();
