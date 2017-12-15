export interface SeedRecipe {
    perform?: (ctx?: any) => (any | Promise<any>);
}
export interface SeederConfig {
    ctx?: any;
}
export declare class Seeder {
    readonly cfg: SeederConfig;
    recipes: SeedRecipe[];
    constructor(cfg?: SeederConfig);
    add(recipe: SeedRecipe): void;
    addDir(dirPath: string): Promise<void>;
    remove(index: number): SeedRecipe[];
    perform(): Promise<number>;
}
