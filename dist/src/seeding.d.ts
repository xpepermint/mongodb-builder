export interface SeedRecipe {
    perform?: (context?: any) => (any | Promise<any>);
}
export interface SeederConfig {
    context?: any;
}
export declare class Seeder {
    readonly cfg: SeederConfig;
    recipes: SeedRecipe[];
    constructor(cfg?: SeederConfig);
    add(recipe: SeedRecipe): void;
    addDir(dir: string): Promise<void>;
    remove(index: number): SeedRecipe[];
    perform(): Promise<number>;
}
