'use strict';

const fs = require('fs');
const url = require('url');
const querystring = require('querystring');
const _ = require('lodash');
const moment = require('moment');
const uaParser = require('ua-parser-js');
const md5 = require('md5');

const ipParser = require('../src/utils/ipip');
const db = require('../src/common/db.js');

let from = parseInt(process.argv[2]);
let to = parseInt(process.argv[3]);

if (!from && from !== 0) {
  from = 0;
  to = 61;
}

if (!to) {
  to = from;
  from = 0;
}

console.log(`from: ${from} to: ${to}`);

let count = 0;
const config = {
  dataPath: __dirname + '/../data',
}
async function main() {
  let files = fs.readdirSync(config.dataPath);
  files = _.filter(files, (file) => {
    if (!file.match(/.+\.log/i)) {
      return false;
    }
    const reg = /\d+/i;
    const fileNumber = parseInt(reg.exec(file)[0]);
    return _.inRange(fileNumber, from, to);
  })
  console.log(files);
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
        await analyzeAndImport(record);
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

  await db.close();
}

async function analyzeAndImport(record) {
  const Analyzed = db.models.analyzed;
  
  const analyzed = {};
  analyzed.host = record.host;
  analyzed.hostName = record.host.slice(0,3);
  analyzed.url = record.url;
  const urlArray = record.url.split(' ');
  analyzed.method = urlArray[0];
  const urlObj = url.parse(decodeURIComponent(urlArray[1]));
  analyzed.path = urlObj.pathname;
  analyzed.query = urlObj.query;
  analyzed.search = querystring.parse(urlObj.query || '')['kw'] || null;
  analyzed.reponseTime = record.reponseTime || null,
  // userAgent
  analyzed.userAgent = record.userAgent;
  if (record.userAgent) {
    const ua = uaParser(record.userAgent);
    analyzed.browserName = ua.browser.name;
    analyzed.browserVersion = ua.browser.version;
    analyzed.deviceType = ua.device.type;
    analyzed.deviceVendor = ua.device.vendor;
    analyzed.deviceModel = ua.device.model;
    analyzed.osName = ua.os.name;
    analyzed.osVersion = ua.os.version;
  }

  // ip
  const ipReg = /(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})/;
  let ip = ipReg.exec(record.ip);
  ip = ip && ip[0];
  if (ip) {
    const ipAddress = ipParser.findSync(ip);
    analyzed.ip = ip;
    analyzed.country = ipAddress[0];
    analyzed.province = ipAddress[1];
    analyzed.city = ipAddress[2];
  }

  //user

  analyzed.user = md5(`${record.userAgent}${record.ip}`);
  analyzed.time = moment(record.time, 'DD/MMM/YYYY:HH:mm:ss').toDate() || null;

  await Analyzed.create(analyzed)
  // console.log(analyzed);
}

main().catch( err => console.error(err));