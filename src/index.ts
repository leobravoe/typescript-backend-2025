import app from "./server/server";

const port = app.get("port");

app.listen(port, () => {
    console.log(`🚀 Servidor rodando em: http://localhost:${port}`);
}); 