import app from "./server/server";

const port: number = app.get("port");

app.listen(port, () => {
    console.log(`🚀 Servidor rodando em: http://localhost:${port}`);
}); 