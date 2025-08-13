import { DataBase } from "../database/DataBase";

type Constructor<T> = new (...args: any[]) => T;

interface BaseModelStatic<T> {
    new(data?: any): T;
    tableName: string;
    insertable?: string[];
    updatable?: string[];
    _colsCache?: string[];
    _pkCache?: string[];
    _getColumns(): Promise<string[]>;
    _getPKCols(): Promise<string[]>;
    _getInsertableCols(): Promise<string[]>;
    _getUpdatableCols(): Promise<string[]>;
}

export class BaseModel {
    // As subclasses devem definir: static tableName
    // Podem opcionalmente definir: static insertable / static updatable

    constructor(data?: any) {
        Object.assign(this, data ?? {});
    }

    // --- Metadados (lazy + cache) ---
    static async _getColumns(this: BaseModelStatic<any>): Promise<string[]> {
        if (!this._colsCache) {
            this._colsCache = await DataBase.getTableColumns(this.tableName);
        }
        return this._colsCache!;
    }

    static async _getPKCols(this: BaseModelStatic<any>): Promise<string[]> {
        if (!this._pkCache) {
            this._pkCache = await DataBase.getPrimaryKeyColumns(this.tableName);
        }
        return this._pkCache!;
    }

    static async _getInsertableCols(this: BaseModelStatic<any>): Promise<string[]> {
        if (this.insertable?.length) return this.insertable;
        const cols = await this._getColumns();
        const pk = await this._getPKCols();
        return cols.filter(
            (c) => !pk.includes(c) && c !== "dataCriacao" && c !== "dataAtualizacao"
        );
    }

    static async _getUpdatableCols(this: BaseModelStatic<any>): Promise<string[]> {
        if (this.updatable?.length) return this.updatable;
        const cols = await this._getColumns();
        const pk = await this._getPKCols();
        return cols.filter((c) => !pk.includes(c) && c !== "dataCriacao");
    }

    // --- CRUD genérico ---
    static async findOne<T>(this: BaseModelStatic<T>, pk: any): Promise<T | null> {
        const table = this.tableName;
        const pkCols = await this._getPKCols();

        let where: string;
        let params: any[];
        if (pkCols.length === 1) {
            where = `${pkCols[0]} = ?`;
            params = [pk];
        } else {
            where = pkCols.map((c) => `${c} = ?`).join(" AND ");
            params = pkCols.map((c) => pk[c]);
        }

        const rows = await DataBase.executeSQLQuery(`SELECT * FROM ${table} WHERE ${where}`, params);
        return Array.isArray(rows) && rows.length === 1 ? new (this as unknown as Constructor<T>)(rows[0]) : null;
    }

    static async findAll<T>(this: BaseModelStatic<T>): Promise<T[]> {
        const rows = await DataBase.executeSQLQuery(`SELECT * FROM ${this.tableName}`);
        if (!Array.isArray(rows)) return [];
        return rows.map((r) => new (this as unknown as Constructor<T>)(r));
    }

    async save<T>(this: T & BaseModel): Promise<T | null> {
        // Chama hook beforeSave se existir
        if ((this as any).beforeSave && typeof (this as any).beforeSave === 'function') {
            await (this as any).beforeSave();
        }

        const cls = this.constructor as unknown as BaseModelStatic<T>;
        const cols = await cls._getInsertableCols();

        // inclui timestamps se existirem na tabela
        const allCols = [...cols];
        const tableCols = await cls._getColumns();
        const now = new Date().toISOString().slice(0, 19).replace("T", " ");
        if (tableCols.includes("dataCriacao")) allCols.push("dataCriacao");
        if (tableCols.includes("dataAtualizacao")) allCols.push("dataAtualizacao");

        const vals = allCols.map((c) => (c === "dataCriacao" || c === "dataAtualizacao" ? now : (this as any)[c]));
        const placeholders = allCols.map(() => "?").join(", ");

        const result: any = await DataBase.executeSQLQuery(
            `INSERT INTO ${cls.tableName} (${allCols.join(", ")}) VALUES (${placeholders})`,
            vals
        );

        const pkCols = await cls._getPKCols();
        if (pkCols.length === 1 && "insertId" in result) {
            return (cls as any).findOne(result.insertId);
        } else if (pkCols.length >= 1) {
            const pkObj: Record<string, any> = {};
            pkCols.forEach((c) => (pkObj[c] = (this as any)[c]));
            return (cls as any).findOne(pkObj);
        }
        return (this as any) as T;
    }

    async update<T>(this: T & BaseModel): Promise<T | null> {
        // Chama hook beforeUpdate se existir
        if ((this as any).beforeUpdate && typeof (this as any).beforeUpdate === 'function') {
            await (this as any).beforeUpdate();
        }

        const cls = this.constructor as unknown as BaseModelStatic<T>;
        const cols = await cls._getUpdatableCols();

        const tableCols = await cls._getColumns();
        const now = new Date().toISOString().slice(0, 19).replace("T", " ");
        const setCols = [...cols];
        if (tableCols.includes("dataAtualizacao")) setCols.push("dataAtualizacao");

        const setClause = setCols.map((c) => `${c} = ?`).join(", ");
        const setVals = setCols.map((c) => (c === "dataAtualizacao" ? now : (this as any)[c]));

        const pkCols = await cls._getPKCols();
        const where = pkCols.map((c) => `${c} = ?`).join(" AND ");
        const pkVals = pkCols.map((c) => (this as any)[c]);

        await DataBase.executeSQLQuery(
            `UPDATE ${cls.tableName} SET ${setClause} WHERE ${where}`,
            [...setVals, ...pkVals]
        );

        if (pkCols.length === 1) {
            return (cls as any).findOne((this as any)[pkCols[0]]);
        } else {
            const pkObj: Record<string, any> = {};
            pkCols.forEach((c) => (pkObj[c] = (this as any)[c]));
            return (cls as any).findOne(pkObj);
        }
    }

    async delete(): Promise<this> {
        const cls = this.constructor as unknown as BaseModelStatic<any>;
        const pkCols = await cls._getPKCols();
        const where = pkCols.map((c) => `${c} = ?`).join(" AND ");
        const pkVals = pkCols.map((c) => (this as any)[c]);
        await DataBase.executeSQLQuery(`DELETE FROM ${cls.tableName} WHERE ${where}`, pkVals);
        return this;
    }
}
