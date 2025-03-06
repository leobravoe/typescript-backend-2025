import { DataBase } from "../database/DataBase";
import { IProdutoDTOWithTipoProdutoDescricao } from "../interfaces/dtos/IProdutoDTOWithTipoProdutoDescricao";
import { IProduto } from "../interfaces/entities/IProduto";

class ProdutoModel {
    id: number | null = null;
    numero: number | null = null;
    nome: string | null = null;
    preco: number | null = null;
    TipoProduto_id: number | null = null;
    ingredientes: string | null = null;
    dataAtualizacao: string | null = null;
    dataCriacao: string | null = null;

    constructor(produto?: IProduto) {
        Object.assign(this, produto ?? {});
    }

    static async findOne(id: number): Promise<ProdutoModel | null> {
        if (!id) return null;

        const result = await DataBase.executeSQLQuery(
            `SELECT * FROM Produto WHERE id = ? LIMIT 1`,
            [id]
        );

        if (Array.isArray(result) && result.length === 1) {
            return new ProdutoModel(result[0] as IProduto);
        }

        return null;
    }

    static async findOneWithTipoProdutoDescricao(id: number): Promise<IProdutoDTOWithTipoProdutoDescricao | null> {
        if (!id) return null;

        const result = await DataBase.executeSQLQuery(
            `SELECT Produto.*, TipoProduto.descricao as TipoProduto_descricao
             FROM Produto
             JOIN TipoProduto ON Produto.TipoProduto_id = TipoProduto.id
             WHERE Produto.id = ?
             ORDER BY Produto.id`,
            [id]
        );

        return (Array.isArray(result) && result.length === 1) ? result[0] as IProdutoDTOWithTipoProdutoDescricao : null;
    }

    static async findAll(): Promise<ProdutoModel[]> {
        const result = await DataBase.executeSQLQuery(`SELECT * FROM Produto`);
        if (!Array.isArray(result)) return [];
        return result.map((produto) => new ProdutoModel(produto as IProduto));
    }

    static async findAllWithTipoProdutoDescricao(): Promise<IProdutoDTOWithTipoProdutoDescricao[]> {
        const result = await DataBase.executeSQLQuery(
            `SELECT Produto.*, TipoProduto.descricao as TipoProduto_descricao
             FROM Produto
             JOIN TipoProduto ON Produto.TipoProduto_id = TipoProduto.id
             ORDER BY Produto.id`
        );
        return Array.isArray(result) ? result as IProdutoDTOWithTipoProdutoDescricao[] : [] as IProdutoDTOWithTipoProdutoDescricao[];
    }

    async save(): Promise<ProdutoModel | null> {
        if (!this.numero || !this.nome || !this.preco || !this.TipoProduto_id || !this.ingredientes) {
            throw new Error("Número, nome, preço, TipoProduto_id e ingredientes são obrigatórios.");
        }

        const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");

        const result = await DataBase.executeSQLQuery(
            `INSERT INTO Produto (numero, nome, preco, TipoProduto_id, ingredientes, dataAtualizacao, dataCriacao)
             VALUES (?, ?, ?, ?, ?, ?, ?);`,
            [this.numero, this.nome, this.preco, this.TipoProduto_id, this.ingredientes, timestamp, timestamp]
        );

        if ("insertId" in result && result.insertId) {
            return await ProdutoModel.findOne(result.insertId);
        }

        return null;
    }

    async update(): Promise<ProdutoModel | null> {
        if (!this.id) throw new Error("ID do produto não informado.");
        if (!this.numero || !this.nome || !this.preco || !this.TipoProduto_id || !this.ingredientes) {
            throw new Error("Número, nome, preço, TipoProduto_id e ingredientes são obrigatórios para atualização.");
        }

        const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");

        const result = await DataBase.executeSQLQuery(
            `UPDATE Produto SET numero = ?, nome = ?, preco = ?, TipoProduto_id = ?, ingredientes = ?, dataAtualizacao = ?
             WHERE id = ?;`,
            [this.numero, this.nome, this.preco, this.TipoProduto_id, this.ingredientes, timestamp, this.id]
        );

        if ("affectedRows" in result && result.affectedRows > 0) {
            return await ProdutoModel.findOne(this.id);
        }

        return null;
    }

    async delete(): Promise<ProdutoModel | null> {
        if (!this.id) throw new Error("ID do produto não informado.");

        const produtoRemovido = await ProdutoModel.findOne(this.id);
        if (!produtoRemovido) return null;

        const result = await DataBase.executeSQLQuery(
            `DELETE FROM Produto WHERE id = ?`,
            [this.id]
        );

        if ("affectedRows" in result && result.affectedRows > 0) {
            return produtoRemovido;
        }

        return null;
    }
}

export { ProdutoModel, IProduto };