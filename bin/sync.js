'use strict';

const db = require('../src/common/db.js');

async function main() {
  await db.sync();
  await db.close();
}

main().catch( err => console.error(err));