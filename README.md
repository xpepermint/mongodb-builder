![Build Status](https://travis-ci.org/xpepermint/mongodb-builder.svg?branch=master)&nbsp;[![NPM Version](https://badge.fury.io/js/migratable.svg)](https://badge.fury.io/js/migratable)&nbsp;[![Dependency Status](https://gemnasium.com/xpepermint/mongodb-builder.svg)](https://gemnasium.com/xpepermint/mongodb-builder)

# Migratable.js

> MongoDB migration framework.

This is a light weight open source package for NodeJS written with [TypeScript](https://www.typescriptlang.org). It's actively maintained, well tested and already used in production environments. The source code is available on [GitHub](https://github.com/xpepermint/mongodb-builder) where you can also find our [issue tracker](https://github.com/xpepermint/mongodb-builder/issues).

## Installation

Run the command below to install the package.

```
$ npm install --save mongodb-builder
```

This package uses promises thus you need to use [Promise polyfill](https://github.com/taylorhakes/promise-polyfill) when promises are not supported.

## Usage

The package provides two core classes. The `Migrator` class is used for running MongoDB migrations and the `Seeder` is used for performing seed operations.

### Migrations

Migrations are performed in a sequence based on the `index` parameter. If you pass a context object into `Migrator` class the object will be passed to each migration method. Methods `upgrade` and `downgrade` runs migration recipes and stores the last successfully performed migration `index` value in the database.

```js
import { MongoClient } from 'mongodb';
import { Migrator } from 'mongodb-builder';

// connecting to the database
const mongo = await MongoClient.connect('mongodb://localhost:27017');

// initialize migration class
const migrator = new Migrator({
  collection: mongo.db('test').collection('migrations'), // required
  ctx: { foo: "foo" }, // optional
});

// register migrations (you could move this object into a separate file)
migrator.add({
  upgrade: async (ctx) => { /* do something */ },
  downgrade: async (ctx) => { /* do something */ },
});

// run `upgrade` migrations
await migrator.upgrade();
```

**Migrator({ db, ctx })**

> Performs MongoDB migration operations.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| collection | Collection | Yes | - | Instance of MongoDB collection.
| ctx | Object | No | - | Object which is passed into each `up` and `down` method.

**migrator.add({ upgrade, downgrade })**

> Registeres new migration recipe.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| upgrade | Function, Promise | Yes | - | Logic for upgrading the database.
| downgrade | Function, Promise | Yes | - | Logic for downgrading the database.

**migrator.addDir(path)**

> Registeres new migration recipes by loading files at `path`.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| path | String | Yes | - | Path to the directory with migration files.

```js
export async function upgrade(ctx) {}
export async function downgrade(ctx) {}
```

**migrator.remove(index)**

> Unregisters migration recipe at index.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| index | Integer | Yes | - | Migration recipe index.

**migrator.upgrade(index)**

> Runs a sequence of registered `upgrade` methods.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| index | Integer | No | - | Sequential number of the last performable method from the beginning.

**migrator.downgrade(index)**

> Runs a sequence of registered `downgrade` methods.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| index | Integer | No | - | Sequential number of the last performable method from the beginning.

**migrator.lastIndex()**

> Runs the last migration index that has already been performed.

### Seeding

Seed operations are similar to migrations. The difference is only that they can be performed multiple times.

```js
import { MongoClient } from 'mongodb';
import { Seeder } from 'migratable';

// connecting to the database
const mongo = await MongoClient.connect('mongodb://localhost:27017');

// initialize migration class
const seeder = new Seeder(
  collection: mongo.db('test').collection('migrations'), // required
  ctx: { foo: "foo" }, // optional
);

// register migrations (you could move this object into a separate file)
seeder.add({
  perform: async (ctx) => { /* do something */ },
});

// run `perform` methods
await seeder.perform();
```

**Seeder({ db, ctx })**

> Performs MongoDB seed operations.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| collection | Collection | Yes | - | Instance of MongoDB collection.
| ctx | Object | No | - | Object which is passed into each `perform` method.

**seeder.add({ seed })**

> Registeres new seed recipe.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| perform | Function, Promise | Yes | - | Logic for seeding the database.

**seeder.addDir(path)**

> Registeres new seed recipes by loading files at `path`.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| path | String | Yes | - | Path to the directory with seed files.

```js
export async function perform(ctx) {}
```

**seeder.remove(index)**

> Unregisters seed recipe at index.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| index | Integer | Yes | - | Seed recipe index.

**seeder.perform(index)**

> Runs a sequence of registered `upgrade` methods.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| index | Integer | No | - | Sequential number of the last performable method from the beginning.

## License (MIT)

```
Copyright (c) 2017+ Kristijan Sedlak <xpepermint@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated modelation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
