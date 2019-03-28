import { Spec } from '@hayspec/spec';
import { MongoClient, Collection } from 'mongodb';
import { Seeder } from '..';

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

spec.test('method `perform` runs seed operations', async (ctx) => {
  const seeder = new Seeder({
    context: { val: 1 },
  });

  let count = 0;
  seeder.add({
    perform: (context) => count = count + context.val, // also testing context
  });
  seeder.add({
    perform: (context) => count = count + context.val,
  });

  let index = await seeder.perform();

  ctx.is(count, 2);
  ctx.is(index, 1);
});

spec.test('method `addDir` loads seeds from directory', async (ctx) => {
  const seeder = new Seeder();

  await seeder.addDir(`${__dirname}/assets/seeds`);

  ctx.is(seeder.recipes.length, 2);
});

export default spec;
