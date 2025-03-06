import { IProduto } from "../entities/IProduto";

interface IProdutoDTOWithTipoProdutoDescricao extends IProduto {
    TipoProduto_descricao: string;
}

export { IProdutoDTOWithTipoProdutoDescricao }