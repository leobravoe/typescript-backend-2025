import hbs from "hbs";

class HbsConfigureCustomHelpers {
    /**
     * Define o custom helper do hbs para realizar comparações de igualdade dentro de uma view .hbs
     */
    static run(): void {
        hbs.registerHelper("igual", (value1: any, value2: any): boolean => {
            return value1 == value2;
        });
    }
}

export { HbsConfigureCustomHelpers };