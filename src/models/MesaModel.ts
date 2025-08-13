import { BaseModel } from "./BaseModel";
import { IMesa } from "../interfaces/entities/IMesa";

class MesaModel extends BaseModel {
  static tableName = "Mesa";

  id: number | null = null;
  numero: number | null = null;
  estado: string | null = null;
  dataAtualizacao: string | null = null;
  dataCriacao: string | null = null;

  constructor(mesa?: IMesa) {
    super(mesa);
    // Inicializa as propriedades apenas se não foram definidas pelo super()
    if (mesa) {
      this.id = mesa.id ?? null;
      this.numero = mesa.numero ?? null;
      this.estado = mesa.estado ?? null;
      this.dataAtualizacao = mesa.dataAtualizacao ?? null;
      this.dataCriacao = mesa.dataCriacao ?? null;
    }
  }
}

export { MesaModel };
