import * as globby from 'globby';
import { Collection } from 'mongodb';

/**
 * Migration recipe interface.
 */
export interface MigrationRecipe {
  upgrade?: (ctx?: any) => (any | Promise<any>);
  downgrade?: (ctx?: any) => (any | Promise<any>);
}

/**
 * Migrator configuration interface.
 */
export interface MigratorConfig {
  collection: Collection;
  ctx?: any;
}

/**
 * Class for performing migrations.
 */
export class Migrator {
  readonly cfg: MigratorConfig;
  public recipes: MigrationRecipe[] = [];

  /**
   * Class constructor.
   * @param cfg Configuration object.
   */
  public constructor(cfg: MigratorConfig) {
    this.cfg = cfg;
  }

  /**
   * Adds migration recipe.
   * @param recipe Migration recipe.
   */
  public add(recipe: MigrationRecipe) {
    this.recipes.push(recipe);
  }

  /**
   * Loads migrations from directory.
   * @param dir Path to a folder with migration files.
   */
  public async addDir(dir: string) {
    let files = await globby([dir]);

    files.sort().forEach((file) => {
      let recipe;
      try { recipe = require(file); } catch (e) {}

      const isValid = (
        !!recipe
        && typeof recipe.upgrade !== 'undefined'
        && typeof recipe.downgrade !== 'undefined'
      );

      if (isValid) {
        this.add(recipe);
      }
    });
  }

  /**
   * Removes migration recipe.
   * @param index Migration recipe index.
   */
  public remove(index: number) {
    return this.recipes.splice(index, 1);
  }

  /**
   * Returns last performed migration index.
   */
  public async lastIndex() {
    let doc = await this.cfg.collection.findOne({ kind: 0 });
    return doc ? doc.index as number : -1;
  }

  /**
   * Runs `upgrade` migration recipe methods.
   * @param steps How many migrations to run.
   */
  public async upgrade(steps: number = -1) {
    if (steps === -1) {
      steps = this.recipes.length;
    }

    let lastIndex = await this.lastIndex();

    for (let i = 0; i < this.recipes.length; i++) {
      let recipe = this.recipes[i];

      if (steps <= lastIndex) {
        break;
      } else if (lastIndex >= i) {
        continue;
      }

      if (recipe.upgrade) {
        await recipe.upgrade(this.cfg.ctx);
        lastIndex++;
        await this.cfg.collection.update({ kind: 0 }, { kind: 0, index: lastIndex }, { upsert: true });
      }
    }

    return lastIndex;
  }

  /**
   * Runs `downgrade` migration recipe methods.
   * @param steps How many migrations to run.
   */
  public async downgrade(steps: number = -1) {
    if (steps === -1) {
      steps = this.recipes.length;
    }

    let lastIndex = await this.lastIndex();

    for (let i = this.recipes.length - 1; i >= 0; i--) {
      let recipe = this.recipes[i];

      if (steps <= this.recipes.length - 1 - i) {
        break;
      }
      if (i > lastIndex) {
        continue;
      }

      if (recipe.downgrade) {
        await recipe.downgrade(this.cfg.ctx);
        lastIndex--;
        await this.cfg.collection.update({ kind: 0 }, { kind: 0, index: lastIndex }, { upsert: true });
      }
    }

    return lastIndex;
  }
}
