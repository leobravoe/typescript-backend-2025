import { IProduto } from "../entities/IProduto";

/**
 * Interface que estende a estrutura de um objeto Produto (IProduto).
 * Inclui a descrição do tipo de produto associada ao produto.
 *
 * @interface IProdutoDTOWithTipoProdutoDescricao
 * @extends {IProduto}
 * 
 * @property {string} TipoProduto_descricao - Descrição do tipo de produto associado ao produto.
 */
interface IProdutoDTOWithTipoProdutoDescricao extends IProduto {
    TipoProduto_descricao: string;
}

export { IProdutoDTOWithTipoProdutoDescricao };