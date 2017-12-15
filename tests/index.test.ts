import test from 'ava';
import * as objectschema from '../src';

test('exposed content', (t) => {
  t.is(!!objectschema.Migrator, true);
  t.is(!!objectschema.Seeder, true);
});
