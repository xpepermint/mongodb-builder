import globby from 'globby';

/**
 * Seed recipe interface.
 */
export interface SeedRecipe {
  perform?: (context?: any) => (any | Promise<any>);
}

/**
 * Migrator configuration interface.
 */
export interface SeederConfig {
  context?: any;
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
  public async addDir(dir: string) {
    let files = await globby([dir]);

    files.sort().forEach((file) => {
      let recipe;
      try { recipe = require(file); } catch (e) {}

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
        await recipe.perform(this.cfg.context);
      }

      lastIndex = i;
    }

    return lastIndex;
  }
}
