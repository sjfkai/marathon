'use strict';

const fs = require('fs');
const _ = require('lodash');
const moment = require('moment');

const db = require('../src/common/db.js');
let count = 0;
const config = {
  dataPath: __dirname + '/../data',
}
async function main() {
  const Original = db.models.original;
  let files = fs.readdirSync(config.dataPath);
  files = _.filter(files, (file) => {
    return !!file.match(/.+\.log/i);
  })
  // console.log(files);
  for (const fileName of files) {
    const data = fs.readFileSync(`${config.dataPath}/${fileName}`, 'utf-8');
    const lines = data.split('\n');
    for (const index in lines) {
      const line = lines[index];
      try {
        const record = JSON.parse(line);
        if (++count % 1000 === 0) {
          console.log(count);
        }
        // save
        await Original.create({
          host: record.host || '',
          url: record.url || '',
          reponseTime: record.reponseTime || null,
          userAgent: record.userAgent || '',
          ip: record.ip || '',
          time: moment('10/Jun/2017:02:01:56 +0800', 'DD/MMM/YYYY:HH:mm:ss').toDate() || null,
        });
      } catch (error) {
        console.error(`
file: ${fileName} 
line:${line + 1} 
content:${line}
`)
        console.error(error);
      }
    }
  }
}

main().catch( err => console.error(err));