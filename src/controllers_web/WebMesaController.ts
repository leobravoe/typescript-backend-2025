import { Response } from "express";
import { ICustomRequest as Request } from "../interfaces/ICustomRequest";
import { MesaModel } from "../models/MesaModel";

class WebMesaController {
    /**
    * Mostra uma tela com todos os recursos
    */
    async index(req: Request, res: Response): Promise<void> {
        try {
            const message = req.session.message || null;
            if (message) delete req.session.message;
            const mesas = await MesaModel.findAll();
            return res.render("mesa/index", {
                layout: "layouts/main",
                title: "Index de Mesa",
                mesas,
                message,
                csrfToken: req.csrfToken()
            });
        } catch (error) {
            return res.render("mesa/index", {
                layout: "layouts/main",
                title: "Index de Mesa",
                mesas: [],
                message: ["danger", JSON.stringify(error)]
            });
        }
    }

    /**
    * Mostra um formulário para criação de um novo recurso
    */
    async create(req: Request, res: Response): Promise<void> {
        try {
            return res.render("mesa/create", {
                layout: "layouts/main",
                title: "Create de Mesa",
                csrfToken: req.csrfToken()
            });
        } catch (error) {
            req.session.message = ["danger", JSON.stringify(error)];
            return res.redirect("/mesa");
        }
    }

    /**
    * Salva um novo recurso no banco de dados
    */
    async store(req: Request, res: Response): Promise<void> {
        try {
            const mesa = new MesaModel();
            mesa.numero = req.body.numero;
            mesa.estado = 'A'; // estado aberta
            const result = await mesa.save();
            req.session.message = ["success", `Mesa salva com sucesso.`];
        } catch (error) {
            req.session.message = ["danger", JSON.stringify(error)];
        }
        return res.redirect("/mesa");
    }

    /**
    * Mostra um recurso específico
    */
    async show(req: Request, res: Response): Promise<void> {
        try {
            const mesa = await MesaModel.findOne(Number(req.params.mesaId));
            if (mesa) {
                res.render("mesa/show", {
                    layout: "layouts/main",
                    title: "Show de Mesa",
                    mesa
                });
                return;
            }
            req.session.message = ["warning", `Mesa ${req.params.mesaId} não encontrada.`];
        } catch (error) {
            req.session.message = ["danger", JSON.stringify(error)];
        }
        return res.redirect("/mesa");
    }

    /**
    * Mostra um formulário para editar um recurso específico
    */
    async edit(req: Request, res: Response): Promise<void> {
        try {
            const mesa = await MesaModel.findOne(Number(req.params.mesaId));
            if (mesa) {
                res.render("mesa/edit", {
                    layout: "layouts/main",
                    title: "Editar Mesa",
                    mesa,
                    csrfToken: req.csrfToken()
                });
                return;
            }
            req.session.message = ["warning", `Mesa ${req.params.mesaId} não encontrada.`];
        } catch (error) {
            req.session.message = ["danger", JSON.stringify(error)];
        }
        return res.redirect("/mesa");
    }

    /**
    * Atualiza um recurso existente no banco de dados
    */
    async update(req: Request, res: Response): Promise<void> {
        try {
            const mesa = await MesaModel.findOne(Number(req.params.mesaId));
            if (!mesa) {
                req.session.message = ["warning", "Mesa não encontrada."];
                res.redirect("/mesa");
                return;
            }
            mesa.numero = req.body.numero;
            const result = await mesa.update();
            req.session.message = ["success", `Mesa atualizada com sucesso.`];
        } catch (error) {
            req.session.message = ["danger", JSON.stringify(error)];
        }
        return res.redirect("/mesa");
    }

    /**
    * Remove um recurso existente do banco de dados
    */
    async destroy(req: Request, res: Response): Promise<void> {
        try {
            const mesa = await MesaModel.findOne(Number(req.params.mesaId));
            if (!mesa) {
                req.session.message = ["warning", "Mesa não encontrada."];
                res.redirect("/mesa");
                return;
            }
            const result = await mesa.delete();
            req.session.message = ["success", `Mesa removida com sucesso.`];
        } catch (error) {
            req.session.message = ["danger", JSON.stringify(error)];
        }
        return res.redirect("/mesa");
    }
}

export default new WebMesaController();
