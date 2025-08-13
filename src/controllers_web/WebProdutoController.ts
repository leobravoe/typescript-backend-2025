import { Response } from "express";
import { ICustomExpressRequest as Request } from "../interfaces/ICustomExpressRequest";
import { ProdutoModel } from "../models/ProdutoModel";
import { TipoProdutoModel } from "../models/TipoProdutoModel";

class WebProdutoController {
    /**
    * Mostra uma tela com todos os recursos
    */
    async index(req: Request, res: Response): Promise<void> {
        try {
            const message = req.session.message || null;
            if (message) delete req.session.message;
            const produtos = await ProdutoModel.findAllWithTipoDescricao();
            return res.render("produto/index", {
                layout: "layouts/main",
                title: "Index de Produto",
                produtos,
                message,
                csrfToken: req.csrfToken()
            });
        } catch (error) {
            return res.render("produto/index", {
                layout: "layouts/main",
                title: "Index de Produto",
                produtos: [],
                message: ["danger", JSON.stringify(error)]
            });
        }
    }

    /**
    * Mostra um formulário para criação de um novo recurso
    */
    async create(req: Request, res: Response): Promise<void> {
        try {
            const tipoProdutos = await TipoProdutoModel.findAll();
            return res.render("produto/create", {
                layout: "layouts/main",
                title: "Create de Produto",
                tipoProdutos,
                csrfToken: req.csrfToken()
            });
        } catch (error) {
            req.session.message = ["danger", JSON.stringify(error)];
        }
        return res.redirect("/produto");
    }

    /**
    * Salva um novo recurso no banco de dados
    */
    async store(req: Request, res: Response): Promise<void> {
        try {
            const produto = new ProdutoModel();
            produto.numero = req.body.numero;
            produto.nome = req.body.nome;
            produto.preco = req.body.preco;
            produto.TipoProduto_id = req.body.TipoProduto_id;
            produto.ingredientes = req.body.ingredientes;
            const result = await produto.save();
            req.session.message = ["success", `Produto salvo com sucesso.`];
        } catch (error) {
            req.session.message = ["danger", JSON.stringify(error)];
        }
        return res.redirect("/produto");
    }

    /**
    * Mostra um recurso específico
    */
    async show(req: Request, res: Response): Promise<void> {
        try {
            const produto = await ProdutoModel.findOneWithTipoDescricao(Number(req.params.produtoId));
            if (produto) {
                return res.render("produto/show", {
                    layout: "layouts/main",
                    title: "Show de Produto",
                    produto
                });
            }
            req.session.message = ["warning", "Produto não encontrado."];
        } catch (error) {
            req.session.message = ["danger", JSON.stringify(error)];
        }
        return res.redirect("/produto");
    }

    /**
    * Mostra um formulário para editar um recurso específico
    */
    async edit(req: Request, res: Response): Promise<void> {
        try {
            const produto = await ProdutoModel.findOne(Number(req.params.produtoId));
            const tipoProdutos = await TipoProdutoModel.findAll();
            if (produto) {
                return res.render("produto/edit", {
                    layout: "layouts/main",
                    title: "Edit de Produto",
                    produto,
                    tipoProdutos,
                    csrfToken: req.csrfToken()
                });
            }
            req.session.message = ["warning", "Produto não encontrado."];
        } catch (error) {
            req.session.message = ["danger", JSON.stringify(error)];
        }
        return res.redirect("/produto");
    }

    /**
    * Atualiza um recurso existente no banco de dados
    */
    async update(req: Request, res: Response): Promise<void> {
        try {
            const produto = await ProdutoModel.findOne(Number(req.params.produtoId));
            if (!produto) {
                req.session.message = ["warning", "Produto não encontrado."];
                return res.redirect("/produto");
            }
            produto.numero = req.body.numero;
            produto.nome = req.body.nome;
            produto.preco = req.body.preco;
            produto.TipoProduto_id = req.body.TipoProduto_id;
            produto.ingredientes = req.body.ingredientes;
            const result = await produto.update();
            req.session.message = ["success", `Produto editado com sucesso.`];
        } catch (error) {
            req.session.message = ["danger", JSON.stringify(error)];
        }
        return res.redirect("/produto");
    }

    /**
    * Remove um recurso existente do banco de dados
    */
    async destroy(req: Request, res: Response): Promise<void> {
        try {
            const produto = await ProdutoModel.findOne(Number(req.params.produtoId));
            if (!produto) {
                req.session.message = ["warning", "Produto não encontrado."];
                return res.redirect("/produto");
            }
            const result = await produto.delete();
            req.session.message = ["success", `Produto removido com sucesso.`];
        } catch (error) {
            req.session.message = ["danger", JSON.stringify(error)];
        }
        return res.redirect("/produto");
    }
}

export default new WebProdutoController();
