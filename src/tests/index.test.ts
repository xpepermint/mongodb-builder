import { Spec } from '@hayspec/spec';
import * as all from '..';

const spec = new Spec();

spec.test('exposed content', (ctx) => {
  ctx.is(!!all.Migrator, true);
  ctx.is(!!all.Seeder, true);
});

export default spec;
