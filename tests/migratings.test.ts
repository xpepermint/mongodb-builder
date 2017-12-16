import test from 'ava';
import { MongoClient } from 'mongodb';
import { Migrator } from '../src';

test.beforeEach(async (t) => {
  t.context.client = await MongoClient.connect('mongodb://localhost:27017');
  t.context.collection = t.context.client.db('test').collection('migrations');
});
test.afterEach(async (t) => {
  await t.context.client.db('test').dropDatabase();
});

test.serial('method `upgrade` runs migrations', async (t) => {
  let count = 0;
  let migrator = new Migrator({
    collection: t.context.collection,
    ctx: { val: 1 }
  });

  migrator.add({
    upgrade: (ctx) => count = count + ctx.val, // also testing context
  });
  migrator.add({
    upgrade: (ctx) => count = count + ctx.val,
  });

  let index = await migrator.upgrade();

  t.is(count, 2);
  t.is(index, 1);
});

test.serial('method `upgrade` runs only new migrations', async (t) => {
  let count = 0;
  let migrator = new Migrator({
    collection: t.context.collection,
  });

  await t.context.collection.update({ kind: 0 }, { kind: 0, index: 0 }, { upsert: true }); // migration index=1 has already been executed

  migrator.add({ // index=0
    upgrade: () => count++,
  });
  migrator.add({ // index=1
    upgrade: () => count++,
  });

  let index = await migrator.upgrade();

  t.is(count, 1);
  t.is(index, 1);
});

test.serial('method `upgrade` performs only a certain number of migrations', async (t) => {
  let count = 0;
  let migrator = new Migrator({
    collection: t.context.collection,
  });

  migrator.add({
    upgrade: () => count++,
  });
  migrator.add({
    upgrade: () => count++,
  });

  let index = await migrator.upgrade(0); // passing number of the last performable index

  t.is(count, 1);
  t.is(index, 0);
});

test.serial('method `downgrade` performs migrations', async (t) => {
  let count = 0;
  let migrator = new Migrator({
    collection: t.context.collection,
    ctx: { val: 1 },
  });

  await t.context.collection.update({ kind: 0 }, { kind: 0, index: 2 }, { upsert: true }); // migration index=1 has already been executed

  migrator.add({
    downgrade: (ctx) => count = count + ctx.val, // also testing context
  });
  migrator.add({
    downgrade: (ctx) => count = count + ctx.val, // also testing context
  });
  migrator.add({
    downgrade: (ctx) => count = count + ctx.val, // also testing context
  });

  let index = await migrator.downgrade();

  t.is(count, 3);
  t.is(index, -1);
});

test.serial('method `downgrade` performs only a certain number of migrations', async (t) => {
  let count = 0;
  let migrator = new Migrator({
    collection: t.context.collection,
  });

  await t.context.collection.update({ kind: 0 }, { kind: 0, index: 1 }, { upsert: true }); // migration index=1 has already been executed

  migrator.add({
    downgrade: () => count++,
  });
  migrator.add({
    downgrade: () => count++,
  });
  migrator.add({
    downgrade: () => count++,
  });

  let index = await migrator.downgrade(2);

  t.is(count, 1);
  t.is(index, 0);
});

test.serial('method `addDir` loads migrations from directory', async (t) => {
  let migrator = new Migrator({
    collection: t.context.collection,
  });
  await migrator.addDir(`${__dirname}/assets/migrations`);

  t.is(migrator.recipes.length, 2);
});
