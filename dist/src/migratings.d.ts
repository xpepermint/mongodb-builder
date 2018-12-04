import { Collection } from 'mongodb';
export interface MigrationRecipe {
    upgrade?: (context?: any) => (any | Promise<any>);
    downgrade?: (context?: any) => (any | Promise<any>);
}
export interface MigratorConfig {
    collection: Collection;
    context?: any;
}
export declare class Migrator {
    readonly cfg: MigratorConfig;
    recipes: MigrationRecipe[];
    constructor(cfg: MigratorConfig);
    add(recipe: MigrationRecipe): void;
    addDir(dir: string): Promise<void>;
    remove(index: number): MigrationRecipe[];
    lastIndex(): Promise<number>;
    upgrade(steps?: number): Promise<number>;
    downgrade(steps?: number): Promise<number>;
}
