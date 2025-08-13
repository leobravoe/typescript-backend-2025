import mysql2, { Connection, QueryResult } from "mysql2/promise";
import * as dotenv from "dotenv";
import fs from "fs/promises";

dotenv.config();

class DataBase {
    /**
     * Abre uma conexão com o Banco de Dados, realiza uma consulta e depois fecha a conexão.
     * @param {string} sql SQL para ser executado no Banco de Dados.
     * @param {any[]} params Array de parâmetros que serão substituídos pelos ? na consulta SQL.
     * @returns {Promise<QueryResult>} Retorna um array de objetos com os resultados da consulta.
     */
    static async executeSQLQuery<T = any>(sql: string, params?: any[]): Promise<T[] | any> {
        const connection: Connection = await mysql2.createConnection({
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });

        const [rows] = await connection.execute(sql, params);
        await connection.end();
        return rows;
    }

    /**
     * Lê um arquivo SQL e executa seu conteúdo no Banco de Dados.
     * @param {string} filePath Caminho do arquivo SQL a ser executado.
     * @returns {Promise<void>}
     */
    static async executeSQLFile(filePath: string): Promise<void> {
        const connection: Connection = await mysql2.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });

        // Lê o conteúdo do arquivo SQL
        const sql: string = await fs.readFile(filePath, "utf8");
        // Divide o SQL em comandos individuais e remove espaços extras
        const commands: string[] = sql.split(";").map(cmd => cmd.trim()).filter(cmd => cmd);

        for (const command of commands) {
            await connection.query(command);
        }

        await connection.end();
    }

    static async getPrimaryKeyColumns(tableName: string): Promise<string[]> {
        const sql = `
      SELECT COLUMN_NAME
        FROM information_schema.KEY_COLUMN_USAGE
       WHERE TABLE_SCHEMA = ?
         AND TABLE_NAME   = ?
         AND CONSTRAINT_NAME = 'PRIMARY'
       ORDER BY ORDINAL_POSITION
    `;
        const params = [process.env.DB_NAME || 'fornatto_db_2', tableName];
        const rows = await this.executeSQLQuery<{ COLUMN_NAME: string }>(sql, params);
        return Array.isArray(rows) ? rows.map(r => (r as any).COLUMN_NAME) : [];
    }

    static async getTableColumns(tableName: string): Promise<string[]> {
        const sql = `
      SELECT COLUMN_NAME
        FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = ?
         AND TABLE_NAME   = ?
       ORDER BY ORDINAL_POSITION
    `;
        const params = [process.env.DB_NAME || 'fornatto_db_2', tableName];
        const rows = await this.executeSQLQuery<{ COLUMN_NAME: string }>(sql, params);
        return Array.isArray(rows) ? rows.map(r => (r as any).COLUMN_NAME) : [];
    }
}

export { DataBase };
