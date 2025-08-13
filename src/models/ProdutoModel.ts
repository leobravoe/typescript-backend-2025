import { BaseModel } from "./BaseModel";
import { DataBase } from "../database/DataBase";
import { IProduto } from "../interfaces/entities/IProduto";
import { IProdutoDTOWithTipoProdutoDescricao } from "../interfaces/dtos/IProdutoDTOWithTipoProdutoDescricao";

class ProdutoModel extends BaseModel {
    static tableName = "Produto";

    id: number | null = null;
    numero: number | null = null;
    nome: string | null = null;
    preco: number | null = null;
    TipoProduto_id: number | null = null;
    ingredientes: string | null = null;
    dataAtualizacao: string | null = null;
    dataCriacao: string | null = null;

    constructor(produto?: IProduto) {
        super(produto);
        // Inicializa as propriedades apenas se não foram definidas pelo super()
        if (produto) {
            this.id = produto.id ?? null;
            this.numero = produto.numero ?? null;
            this.nome = produto.nome ?? null;
            this.preco = produto.preco ?? null;
            this.TipoProduto_id = produto.TipoProduto_id ?? null;
            this.ingredientes = produto.ingredientes ?? null;
            this.dataAtualizacao = produto.dataAtualizacao ?? null;
            this.dataCriacao = produto.dataCriacao ?? null;
        }
    }

    // --- métodos específicos com JOIN (mantidos) ---

    static async findOneWithTipoDescricao(id: number): Promise<IProdutoDTOWithTipoProdutoDescricao | null> {
        if (!id) return null;
        const rows = await DataBase.executeSQLQuery(
            `SELECT p.*, t.descricao as TipoProduto_descricao
         FROM Produto p
         JOIN TipoProduto t ON p.TipoProduto_id = t.id
        WHERE p.id = ?`,
            [id]
        );
        return Array.isArray(rows) && rows.length === 1 ? (rows[0] as IProdutoDTOWithTipoProdutoDescricao) : null;
    }

    static async findAllWithTipoDescricao(): Promise<IProdutoDTOWithTipoProdutoDescricao[]> {
        const rows = await DataBase.executeSQLQuery(
            `SELECT p.*, t.descricao as TipoProduto_descricao
         FROM Produto p
         JOIN TipoProduto t ON p.TipoProduto_id = t.id
        ORDER BY p.id`
        );
        return Array.isArray(rows) ? (rows as IProdutoDTOWithTipoProdutoDescricao[]) : [];
    }
}

export { ProdutoModel };
