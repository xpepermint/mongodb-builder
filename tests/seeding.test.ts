import test from 'ava';
import { MongoClient } from 'mongodb';
import { Seeder } from '../src';

test.beforeEach(async (t) => {
  t.context.client = await MongoClient.connect('mongodb://localhost:27017/test', { useNewUrlParser: true });
  t.context.collection = t.context.client.db('test').collection('migrations');
});
test.afterEach(async (t) => {
  await t.context.client.db('test').dropDatabase();
});

test.serial('method `perform` runs seed operations', async (t) => {
  let count = 0;
  let seeder = new Seeder({
    context: { val: 1 },
  });

  seeder.add({
    perform: (context) => count = count + context.val, // also testing context
  });
  seeder.add({
    perform: (context) => count = count + context.val,
  });

  let index = await seeder.perform();

  t.is(count, 2);
  t.is(index, 1);
});

test.serial('method `addDir` loads seeds from directory', async (t) => {
  let seeder = new Seeder();
  await seeder.addDir(`${__dirname}/assets/seeds`);

  t.is(seeder.recipes.length, 2);
});
