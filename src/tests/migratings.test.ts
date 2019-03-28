import { Spec } from '@hayspec/spec';
import { MongoClient, Collection } from 'mongodb';
import { Migrator } from '..';

const spec = new Spec<{
  client: MongoClient;
  collection: Collection;
}>();

spec.beforeEach(async (s) => {
  const client = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true });
  s.set('client', client);
  s.set('collection', client.db('test').collection('migrations'));
});

spec.afterEach(async (s) => {
  await s.get('client').db('test').dropDatabase();
});

spec.test('method `upgrade` runs migrations', async (ctx) => {
  const migrator = new Migrator({
    collection: ctx.get('collection'),
    context: { val: 1 },
  });

  let count = 0;
  migrator.add({
    upgrade: (context) => count = count + context.val, // also testing context
  });
  migrator.add({
    upgrade: (context) => count = count + context.val,
  });

  let index = await migrator.upgrade();

  ctx.is(count, 2);
  ctx.is(index, 1);
});

spec.test('method `upgrade` runs only new migrations', async (ctx) => {
  const migrator = new Migrator({
    collection: ctx.get('collection'),
  });

  await ctx.get('collection').updateMany({ kind: 0 }, { $set: { kind: 0, index: 0 } }, { upsert: true }); // migration index=1 has already been executed

  let count = 0;
  migrator.add({ // index=0
    upgrade: () => count++,
  });
  migrator.add({ // index=1
    upgrade: () => count++,
  });

  let index = await migrator.upgrade();

  ctx.is(count, 1);
  ctx.is(index, 1);
});

spec.test('method `upgrade` performs only a certain number of migrations', async (ctx) => {
  const migrator = new Migrator({
    collection: ctx.get('collection'),
  });

  let count = 0;
  migrator.add({
    upgrade: () => count++,
  });
  migrator.add({
    upgrade: () => count++,
  });

  let index = await migrator.upgrade(0); // passing number of the last performable index

  ctx.is(count, 1);
  ctx.is(index, 0);
});

spec.test('method `downgrade` performs migrations', async (ctx) => {
  const migrator = new Migrator({
    collection: ctx.get('collection'),
    context: { val: 1 },
  });

  await ctx.get('collection').updateMany({ kind: 0 }, { $set: { kind: 0, index: 2 } }, { upsert: true }); // migration index=1 has already been executed

  let count = 0;
  migrator.add({
    downgrade: (context) => count = count + context.val, // also testing context
  });
  migrator.add({
    downgrade: (context) => count = count + context.val, // also testing context
  });
  migrator.add({
    downgrade: (context) => count = count + context.val, // also testing context
  });

  let index = await migrator.downgrade();

  ctx.is(count, 3);
  ctx.is(index, -1);
});

spec.test('method `downgrade` performs only a certain number of migrations', async (ctx) => {
  const migrator = new Migrator({
    collection: ctx.get('collection'),
  });

  await ctx.get('collection').updateMany({ kind: 0 }, { $set: { kind: 0, index: 1 } }, { upsert: true }); // migration index=1 has already been executed

  let count = 0;
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

  ctx.is(count, 1);
  ctx.is(index, 0);
});

spec.test('method `addDir` loads migrations from directory', async (ctx) => {
  const migrator = new Migrator({
    collection: ctx.get('collection'),
  });

  await migrator.addDir(`${__dirname}/assets/migrations`);

  ctx.is(migrator.recipes.length, 2);
});

export default spec;
