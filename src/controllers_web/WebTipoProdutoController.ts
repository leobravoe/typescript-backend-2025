import { Response } from "express";
import { ICustomExpressRequest as Request } from "../interfaces/ICustomExpressRequest";
import { TipoProdutoModel } from "../models/TipoProdutoModel";

class WebTipoProdutoController {
    /**
     * Mostra uma tela com todos os recursos
     * @param {Request} req Requisição da rota do express
     * @param {Response} res Resposta da rota do express
     */
    async index(req: Request, res: Response): Promise<void> {
        try {
            const message = req.session.message || null;
            if (message) delete req.session.message;
            const tipoProdutos = await TipoProdutoModel.findAll();
            return res.render("tipoproduto/index", {
                layout: "layouts/main",
                title: "Index de TipoProduto",
                tipoProdutos,
                message,
                csrfToken: req.csrfToken()
            });
        } catch (error) {
            return res.render("tipoproduto/index", {
                layout: "layouts/main",
                title: "Index de TipoProduto",
                tipoProdutos: [],
                message: ["danger", JSON.stringify(error)]
            });
        }
    }

    /**
     * Mostra um formulário para criação de um novo recurso
     * @param {Request} req Requisição da rota do express
     * @param {Response} res Resposta da rota do express
     */
    async create(req: Request, res: Response): Promise<void> {
        try {
            return res.render("tipoproduto/create", {
                layout: "layouts/main",
                title: "Create de TipoProduto",
                csrfToken: req.csrfToken()
            });
        } catch (error) {
            req.session.message = ["danger", JSON.stringify(error)];
        }
        return res.redirect("/tipoproduto");
    }

    /**
     * Salva um novo recurso no banco de dados
     * @param {Request} req Requisição da rota do express
     * @param {Response} res Resposta da rota do express
     */
    async store(req: Request, res: Response): Promise<void> {
        try {
            const tipoProduto = new TipoProdutoModel();
            tipoProduto.descricao = req.body.descricao;
            const result = await tipoProduto.save();
            req.session.message = ["success", `TipoProduto salvo com sucesso.`];
        } catch (error) {
            req.session.message = ["danger", JSON.stringify(error)];
        }
        return res.redirect("/tipoproduto");
    }

    /**
     * Mostra um recurso específico
     * @param {Request} req Requisição da rota do express
     * @param {Response} res Resposta da rota do express
     */
    async show(req: Request, res: Response): Promise<void> {
        try {
            const tipoProduto = await TipoProdutoModel.findOne(Number(req.params.tipoProdutoId));
            if (tipoProduto) {
                return res.render("tipoproduto/show", {
                    layout: "layouts/main",
                    title: "Show de TipoProduto",
                    tipoProduto
                });
            }
            req.session.message = ["warning", "TipoProduto não encontrado."];
        } catch (error) {
            req.session.message = ["danger", JSON.stringify(error)];
        }
        return res.redirect("/tipoproduto");
    }

    /**
     * Mostra um formulário para editar um recurso específico
     * @param {Request} req Requisição da rota do express
     * @param {Response} res Resposta da rota do express
     */
    async edit(req: Request, res: Response): Promise<void> {
        try {
            const tipoProduto = await TipoProdutoModel.findOne(Number(req.params.tipoProdutoId));
            if (tipoProduto) {
                return res.render("tipoproduto/edit", {
                    layout: "layouts/main",
                    title: "Editar TipoProduto",
                    tipoProduto,
                    csrfToken: req.csrfToken()
                });
            }
            req.session.message = ["warning", "TipoProduto não encontrado."];
        } catch (error) {
            req.session.message = ["danger", JSON.stringify(error)];
        }
        return res.redirect("/tipoproduto");
    }

    /**
     * Atualiza um recurso existente no banco de dados
     * @param {Request} req Requisição da rota do express
     * @param {Response} res Resposta da rota do express
     */
    async update(req: Request, res: Response): Promise<void> {
        try {
            const tipoProduto = await TipoProdutoModel.findOne(Number(req.params.tipoProdutoId));
            if (!tipoProduto) {
                req.session.message = ["warning", "TipoProduto não encontrado."];
                return res.redirect("/tipoproduto");
            }
            tipoProduto.descricao = req.body.descricao;
            const result = await tipoProduto.update();
            req.session.message = ["success", `TipoProduto atualizado com sucesso.`];
        } catch (error) {
            req.session.message = ["danger", JSON.stringify(error)];
        }
        return res.redirect("/tipoproduto");
    }

    /**
     * Remove um recurso existente do banco de dados
     * @param {Request} req Requisição da rota do express
     * @param {Response} res Resposta da rota do express
     */
    async destroy(req: Request, res: Response): Promise<void> {
        try {
            const tipoProduto = await TipoProdutoModel.findOne(Number(req.params.tipoProdutoId));
            if (!tipoProduto) {
                req.session.message = ["warning", "TipoProduto não encontrado."];
                return res.redirect("/tipoproduto");
            }
            const result = await tipoProduto.delete();
            req.session.message = ["success", `TipoProduto removido com sucesso.`];
        } catch (error) {
            req.session.message = ["danger", JSON.stringify(error)];
        }
        return res.redirect("/tipoproduto");
    }
}

export default new WebTipoProdutoController();