import { BaseModel } from "./BaseModel";
import { ITipoProduto } from "../interfaces/entities/ITipoProduto";

class TipoProdutoModel extends BaseModel {
    static tableName = "TipoProduto";

    id: number | null = null;
    descricao: string | null = null;
    dataAtualizacao: string | null = null;
    dataCriacao: string | null = null;

    constructor(tipoProduto?: ITipoProduto) {
        super(tipoProduto);
        // Inicializa as propriedades apenas se não foram definidas pelo super()
        if (tipoProduto) {
            this.id = tipoProduto.id ?? null;
            this.descricao = tipoProduto.descricao ?? null;
            this.dataAtualizacao = tipoProduto.dataAtualizacao ?? null;
            this.dataCriacao = tipoProduto.dataCriacao ?? null;
        }
    }
}

export { TipoProdutoModel };
