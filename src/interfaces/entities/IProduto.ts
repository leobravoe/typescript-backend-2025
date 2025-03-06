interface IProduto {
    id?: number;
    numero: number;
    nome: string;
    preco: number;
    TipoProduto_id: number;
    ingredientes: string;
    dataAtualizacao?: string;
    dataCriacao?: string;
}

export { IProduto };