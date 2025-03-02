import { Router, Request, Response } from "express";
import webSessionAuthMiddleware from "../route_middlewares/webSessionAuthMiddleware";
import webMesaController from "../controllers_web/WebMesaController";
import webUsuarioController from "../controllers_web/WebUsuarioController";
// import webProdutoController from "../controllers_web/WebProdutoController";
// import webTipoProdutoController from "../controllers_web/WebTipoProdutoController";

const router: Router = Router();

// Rotas de Mesa
router.get("/mesa", webSessionAuthMiddleware, webMesaController.index);
router.get("/mesa/create", webSessionAuthMiddleware, webMesaController.create);
router.post("/mesa", webSessionAuthMiddleware, webMesaController.store);
router.get("/mesa/:mesaId", webSessionAuthMiddleware, webMesaController.show);
router.get("/mesa/:mesaId/edit", webSessionAuthMiddleware, webMesaController.edit);
router.put("/mesa/:mesaId", webSessionAuthMiddleware, webMesaController.update);
router.delete("/mesa/:mesaId", webSessionAuthMiddleware, webMesaController.destroy);

// Rotas de TipoProduto
// router.get("/tipoproduto", webSessionAuthMiddleware, webTipoProdutoController.index);
// router.get("/tipoproduto/create", webSessionAuthMiddleware, webTipoProdutoController.create);
// router.post("/tipoproduto", webSessionAuthMiddleware, webTipoProdutoController.store);
// router.get("/tipoproduto/:tipoProdutoId", webSessionAuthMiddleware, webTipoProdutoController.show);
// router.get("/tipoproduto/:tipoProdutoId/edit", webSessionAuthMiddleware, webTipoProdutoController.edit);
// router.put("/tipoproduto/:tipoProdutoId", webSessionAuthMiddleware, webTipoProdutoController.update);
// router.delete("/tipoproduto/:tipoProdutoId", webSessionAuthMiddleware, webTipoProdutoController.destroy);

// Rotas de Produto
// router.get("/produto", webSessionAuthMiddleware, webProdutoController.index);
// router.get("/produto/create", webSessionAuthMiddleware, webProdutoController.create);
// router.post("/produto", webSessionAuthMiddleware, webProdutoController.store);
// router.get("/produto/:produtoId", webSessionAuthMiddleware, webProdutoController.show);
// router.get("/produto/:produtoId/edit", webSessionAuthMiddleware, webProdutoController.edit);
// router.put("/produto/:produtoId", webSessionAuthMiddleware, webProdutoController.update);
// router.delete("/produto/:produtoId", webSessionAuthMiddleware, webProdutoController.destroy);

// // Rotas de Usuário
router.get("/usuario/login", webUsuarioController.loginForm);
router.post("/usuario/login", webUsuarioController.login);
router.post("/usuario/logout", webUsuarioController.logout);
router.get("/usuario", webUsuarioController.index);
router.get("/usuario/create", webUsuarioController.create);
router.post("/usuario", webUsuarioController.store);
router.get("/usuario/:id", webSessionAuthMiddleware, webUsuarioController.show);
router.get("/usuario/:id/edit", webSessionAuthMiddleware, webUsuarioController.edit);
router.get("/usuario/:id/editemailpassword", webSessionAuthMiddleware, webUsuarioController.editEmailPassword);
router.put("/usuario/:id/editemailpassword", webSessionAuthMiddleware, webUsuarioController.updateEmailPassword);
router.put("/usuario/:id", webSessionAuthMiddleware, webUsuarioController.update);
router.delete("/usuario/:id", webSessionAuthMiddleware, webUsuarioController.destroy);

// Demais rotas ainda sem controlador (iremos criar um controlador para essas rotas no futuro)
router.get("/recurso", async (request: Request, response: Response) => {
    response.render("Recurso/index", { layout: "layouts/main", title: "Recursos" });
});

router.get("/", async (request: Request, response: Response) => {
    response.render("index", { layout: "layouts/main", title: "Página inicial" });
});

export default router;
