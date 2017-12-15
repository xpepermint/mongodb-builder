import * as path from 'path';
import * as fs from 'mz/fs';

/**
 * Seed recipe interface.
 */
export interface SeedRecipe {
  perform?: (ctx?: any) => (any | Promise<any>);
}

/**
 * Migrator configuration interface.
 */
export interface SeederConfig {
  ctx?: any;
}

/**
 * Class for performing seed operations.
 */
export class Seeder {
  readonly cfg: SeederConfig;
  public recipes: SeedRecipe[] = [];

  /**
   * Class constructor.
   * @param cfg Configuration object.
   */
  public constructor(cfg: SeederConfig = {}) {
    this.cfg = cfg;
  }

  /**
   * Adds seed recipe.
   * @param recipe Seed recipe.
   */
  public add(recipe: SeedRecipe) {
    this.recipes.push(recipe);
  }

  /**
   * Loads seeds from directory.
   * @param dirPath Path to a folder with seed files.
   */
  public async addDir(dirPath: string) {
    let fileNames = await fs.readdir(dirPath);

    fileNames.forEach((fileName) => {
      let recipe;
      try { recipe = require(path.join(dirPath, fileName)); } catch (e) {}

      const isValid = (
        !!recipe
        && typeof recipe.perform !== 'undefined'
      );
      if (isValid) {
        this.add(recipe);
      }
    });
  }

  /**
   * Removes seed recipe.
   * @param index Seed recipe index.
   */
  public remove(index: number) {
    return this.recipes.splice(index, 1);
  }

  /**
   * Runs `perform` recipe methods.
   */
  public async perform() {
    let lastIndex = -1;

    for (let i = 0; i < this.recipes.length; i++) {
      let recipe = this.recipes[i];

      if (recipe.perform) {
        await recipe.perform(this.cfg.ctx);
      }

      lastIndex = i;
    }

    return lastIndex;
  }
}
