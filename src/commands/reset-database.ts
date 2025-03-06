import { DataBase } from "../database/DataBase";

(async () => {
    try {
        await DataBase.executeSQLFile("src/database/sqlbanco.sql");
        console.log("✅ Arquivo SQL executado com sucesso.");
    } catch (error) {
        console.error("❌ Erro ao executar o arquivo SQL:", error);
    }
})();
